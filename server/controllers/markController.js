const markModel = require('../models/Mark')
const projectModel = require('../models/Project')
const utility = require('../helper/utility')

exports.addMark = async function (req, res) {
    try {
        const data = req.body
        const studentId = req.params.studentId
        const teacherId = req.params.teacherId
        const projectId = req.params.projectId

        const projectType = await projectModel.getProjectByUserIdAndType(studentId, 1);

        const marks = await projectModel.listMark(projectId);
        if (projectType) {

            const processMarkType = 3;
            const existingProcessMark = marks.find(item => item.type === processMarkType);
            const project = await projectModel.getApprovedProjectsByUserId(studentId);

            const marksProject1 = await projectModel.listMark(project[0]._id);
            const marksProject2 = await projectModel.listMark(project[1]._id);
            const executionMarks = marksProject1.concat(marksProject2)
                .filter(item => item.type === 1)
                .map(item => item.mark);

            const guidanceMarks = marksProject1.concat(marksProject2)
                .filter(item => item.type === 0)
                .map(item => item.mark);

            const avgExecutionMark = executionMarks.reduce((sum, mark) => sum + mark, 0) / executionMarks.length;
            const avgGuidanceMark = guidanceMarks.reduce((sum, mark) => sum + mark, 0) / guidanceMarks.length;

            const processMark = ((avgExecutionMark + 2 * avgGuidanceMark) / 3).toFixed(1);
            if (existingProcessMark) {
                await markModel.update(existingProcessMark._id, { mark: processMark });
            } else {
                const newProcessMark = await markModel.create(teacherId, {
                    mark: 0,
                    type: processMarkType,
                    comment: '',
                });
                await projectModel.addMark(projectId, newProcessMark._id);
                await markModel.update(newProcessMark._id, { mark: processMark });
            }

            const type2Marks = marks.filter(item => item.type === 2);
            let defenseMark;
            const defenseMarkType = 4;
            const existingDefenseMark = marks.find(item => item.type === defenseMarkType);

            if (type2Marks.length > 0) {
                defenseMark = type2Marks.reduce((sum, mark) => sum + mark.mark, 0).toFixed(1);
            } else {
                defenseMark = 0;
            }
            if (existingDefenseMark) {
                await markModel.update(existingDefenseMark._id, { mark: defenseMark });
            } else {
                const newDefenseMark = await markModel.create(teacherId, {
                    mark: defenseMark,
                    type: defenseMarkType,
                    comment: '',
                });
                await projectModel.addMark(projectId, newDefenseMark._id);
            }

            const finalMarkType = 5;
            const existingFinalMark = marks.find(item => item.type === finalMarkType);
            let finalMark = 0.3 * processMark + 0.7 * defenseMark;
            if( existingFinalMark ) {
                await markModel.update(existingFinalMark._id, { mark: finalMark });
            } else {
                const newFinalMark = await markModel.create(teacherId, {
                    mark: finalMark,
                    type: finalMarkType,
                    comment: '',
                });
                await projectModel.addMark(projectId, newFinalMark._id);
            }
        }

        const checkMark = marks.filter(item => item.type === data.type && item.teacherId.toString() == teacherId);
        if (checkMark.length >= 1) {
            return res.status(200).json({ state: 422, markData: checkMark })
        }

        const newMark = await markModel.create(teacherId, data)
        if (!newMark) {
            return res.status(500).json({ message: 'error' })
        } else {
            const updatedProject = await projectModel.addMark(projectId, newMark._id)
            return res.status(200).json(updatedProject)
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e })
    }
}

exports.listMark = async function (req, res) {
    try {
        const projectId = req.params.projectId
        const marks = await projectModel.listMark(projectId)
        return res.status(200).json(marks)
    } catch (e) {
        return res.status(500).json({ message: e })
    }
}

exports.updateProject = async function (req, res) {
    const markId = req.params.markId
    const data = req.body
    console.log(data, markId)
    try {
        const result = await markModel.update(markId, data)
        return res.status(200).json(result)
    } catch (err) {
        return res.status(404).json({ msg: 'error', data: err })
    }
}