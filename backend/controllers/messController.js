import MessLeave from '../models/MessLeave.js';
import MessMenu from '../models/MessMenu.js';
import MessCandidate from '../models/MessCandidate.js';
import MessPoll from '../models/MessPoll.js';
import Student from '../models/Student.js';

// --- MESS MENU ---
export const getMenu = async (req, res) => {
    try {
        const menu = await MessMenu.find({});
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu' });
    }
};

export const updateMenu = async (req, res) => {
    try {
        const { day, breakfast, lunch, snacks, dinner } = req.body;
        // Verify student is mess sec
        const student = await Student.findOne({ user: req.user._id });
        if (!student || (!student.isMessSec && req.user.role !== 'Admin')) {
            return res.status(403).json({ message: 'Not authorized to change menu' });
        }

        let menu = await MessMenu.findOne({ day });
        if (!menu) {
            menu = new MessMenu({ day, breakfast, lunch, snacks, dinner, lastUpdatedBy: student ? student._id : null });
        } else {
            menu.breakfast = breakfast || menu.breakfast;
            menu.lunch = lunch || menu.lunch;
            menu.snacks = snacks || menu.snacks;
            menu.dinner = dinner || menu.dinner;
            menu.lastUpdatedBy = student ? student._id : null;
        }
        await menu.save();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Error updating menu' });
    }
};

// --- MESS LEAVE ---
export const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const student = await Student.findOne({ user: req.user._id });

        const leave = new MessLeave({
            student: student._id,
            startDate,
            endDate,
            reason
        });
        await leave.save();
        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Error applying for leave' });
    }
};

export const getMyLeaves = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });
        const leaves = await MessLeave.find({ student: student._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaves' });
    }
};

export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await MessLeave.find({}).populate({ path: 'student', populate: { path: 'user' } }).sort({ startDate: 1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all leaves' });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { status, rebateDays } = req.body;
        const leave = await MessLeave.findById(req.params.id);
        if (leave) {
            leave.status = status;
            if (rebateDays) leave.rebateDays = rebateDays;
            await leave.save();
            res.json(leave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating leave status' });
    }
};

// --- MESS ELECTIONS ---
export const getActivePoll = async (req, res) => {
    try {
        let poll = await MessPoll.findOne({ status: 'Active' }).populate({
            path: 'candidates',
            populate: { path: 'student', populate: { path: 'user' } }
        });

        if (!poll) {
            const lastPoll = await MessPoll.findOne({ status: 'Completed' })
                .sort({ updatedAt: -1 })
                .populate({
                    path: 'candidates',
                    populate: { path: 'student', populate: { path: 'user' } }
                });
            return res.json({ poll: lastPoll, active: false });
        }

        // Check if expired
        if (new Date() > new Date(poll.endTime)) {
            poll.status = 'Completed';
            await poll.save();

            // Resolve winners
            const vegCandidates = poll.candidates.filter(c => c.type === 'Veg').sort((a, b) => b.votes - a.votes);
            const nonVegCandidates = poll.candidates.filter(c => c.type === 'Non-Veg').sort((a, b) => b.votes - a.votes);

            for (let c of poll.candidates) {
                c.status = 'Lost';
            }

            if (vegCandidates.length > 0) {
                const winner = vegCandidates[0];
                winner.status = 'Winner';
                if (winner.student) await Student.findByIdAndUpdate(winner.student, { isMessSec: true }); // winner.student is ObjectId since we didn't populate it deeply here or wait, we did populate it!
                // wait, if we populated it deeply above, it might be an object.
                // let's just update safely:
                const studentId = winner.student?._id || winner.student;
                if (studentId) await Student.findByIdAndUpdate(studentId, { isMessSec: true });
            }
            if (nonVegCandidates.length > 0) {
                const winner = nonVegCandidates[0];
                winner.status = 'Winner';
                const studentId = winner.student?._id || winner.student;
                if (studentId) await Student.findByIdAndUpdate(studentId, { isMessSec: true });
            }

            for (let c of poll.candidates) await c.save();

            return res.json({ poll, active: false });
        }

        const student = await Student.findOne({ user: req.user._id });
        const hasVoted = student ? poll.voters.includes(student._id) : false;

        res.json({ poll, active: true, hasVoted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching poll' });
    }
};

export const createPoll = async (req, res) => {
    try {
        const { durationHours, candidates } = req.body;

        const active = await MessPoll.findOne({ status: 'Active' });
        if (active) return res.status(400).json({ message: 'A poll is already active' });

        await Student.updateMany({ isMessSec: true }, { isMessSec: false });

        const createdCandidates = [];
        for (let c of candidates) {
            const existingStudent = await Student.findOne({ rollNo: c.rollNo });
            const newCand = new MessCandidate({
                name: c.name,
                rollNo: c.rollNo,
                branch: c.branch,
                year: c.year,
                type: c.type,
                student: existingStudent ? existingStudent._id : null,
                votes: 0,
                status: 'Nominated'
            });
            await newCand.save();
            createdCandidates.push(newCand._id);
        }

        const endTime = new Date(Date.now() + durationHours * 60 * 60 * 1000);
        const poll = new MessPoll({
            candidates: createdCandidates,
            endTime,
            status: 'Active'
        });
        await poll.save();
        res.status(201).json(poll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating poll' });
    }
};

export const voteCandidate = async (req, res) => {
    try {
        const { pollId, candidateId } = req.body;
        const student = await Student.findOne({ user: req.user._id });
        if (!student) return res.status(400).json({ message: 'Student profile not found' });

        const poll = await MessPoll.findById(pollId);
        if (!poll || poll.status !== 'Active') return res.status(400).json({ message: 'No active poll' });

        if (poll.voters.includes(student._id)) {
            return res.status(400).json({ message: 'Already voted' });
        }

        const candidate = await MessCandidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

        candidate.votes += 1;
        await candidate.save();

        poll.voters.push(student._id);
        await poll.save();

        res.json({ message: 'Voted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error voting' });
    }
};
