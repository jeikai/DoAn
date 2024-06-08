const markModel = require('../models/Mark')
const projectModel = require('../models/Project')
const fs = require('fs');
const HTMLToPDF = require('convert-html-to-pdf').default;
const path = require('path');
const os = require('os');

exports.addMark = async function (req, res) {
    try {
        const data = req.body
        const studentId = req.params.studentId
        const teacherId = req.params.teacherId
        const projectId = req.params.projectId
        const project = await projectModel.get(studentId, projectId);
        const projectType = project && project.type === 1;
        const marks = await projectModel.listMark(projectId);

        const checkMark = marks.filter(item => item.type === data.type && item.teacherId.toString() == teacherId);
        if (checkMark.length >= 1) {
            const markId = checkMark[0]._id;
            const result = await markModel.update(markId, data);
            const updatedMarks = await projectModel.listMark(projectId);
            if (projectType) {
                const processMarkType = 3;
                const existingProcessMark = updatedMarks.find(item => item.type === processMarkType);
                const project = await projectModel.getApprovedProjectsByUserId(studentId);
                const marksProject1 = await projectModel.listMark(project[0]._id);
                const marksProject2 = await projectModel.listMark(project[1]._id);
                const executionMarks = marksProject1.concat(marksProject2)
                    .filter(item => item.type === 1)
                    .map(item => item.mark);

                const guidanceMarks = marksProject1.concat(marksProject2)
                    .filter(item => item.type === 0)
                    .map(item => item.mark);

                const avgExecutionMark = executionMarks.length > 0
                    ? executionMarks.reduce((sum, mark) => sum + mark, 0) / executionMarks.length
                    : 0;

                const avgGuidanceMark = guidanceMarks.length > 0
                    ? guidanceMarks.reduce((sum, mark) => sum + mark, 0) / guidanceMarks.length
                    : 0;
                const processMark = ((avgExecutionMark + 2 * avgGuidanceMark) / 3).toFixed(1);
                await markModel.update(existingProcessMark._id, { mark: processMark });

                const defenseMarkType = 4;
                const type2Marks = updatedMarks.filter(item => item.type === 2);
                let defenseMark;
                const existingDefenseMark = updatedMarks.find(item => item.type === defenseMarkType);
                defenseMark = type2Marks.length > 0 ? (type2Marks.reduce((sum, mark) => sum + mark.mark, 0) / type2Marks.length).toFixed(1) : 0;
                await markModel.update(existingDefenseMark._id, { mark: defenseMark });

                const finalMarkType = 5;
                const existingFinalMark = updatedMarks.find(item => item.type === finalMarkType);
                let finalMark = (0.3 * processMark + 0.7 * defenseMark).toFixed(1);
                await markModel.update(existingFinalMark._id, { mark: finalMark });
            }
            return res.status(200).json({ result, state: 1 })
        }
        const newMark = await markModel.create(teacherId, {
            mark: parseFloat(data.mark),
            type: data.type,
            comment: data.comment,
        });
        if (projectType) {
            const updatedMarks = await projectModel.listMark(projectId);
            let processMark = 0;
            const processMarkType = 3;
            const existingProcessMark = updatedMarks.find(item => item.type === processMarkType);
            const project = await projectModel.getApprovedProjectsByUserId(studentId);
            const marksProject1 = await projectModel.listMark(project[0]._id);
            const marksProject2 = await projectModel.listMark(project[1]._id);
            const executionMarks = marksProject1.concat(marksProject2)
                .filter(item => item.type === 1)
                .map(item => item.mark);

            const guidanceMarks = marksProject1.concat(marksProject2)
                .filter(item => item.type === 0)
                .map(item => item.mark);

            const avgExecutionMark = executionMarks.length > 0
                ? executionMarks.reduce((sum, mark) => sum + mark, 0) / executionMarks.length
                : 0;

            const avgGuidanceMark = guidanceMarks.length > 0
                ? guidanceMarks.reduce((sum, mark) => sum + mark, 0) / guidanceMarks.length
                : 0;

            processMark = ((avgExecutionMark + 2 * avgGuidanceMark) / 3).toFixed(1);
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

            let defenseMark = 0;
            const type2Marks = updatedMarks.filter(item => item.type === 2);
            console.log(type2Marks)
            const defenseMarkType = 4;
            const existingDefenseMark = updatedMarks.find(item => item.type === defenseMarkType);
            defenseMark = type2Marks.length > 0 ? (type2Marks.reduce((sum, mark) => sum + mark.mark, 0) / type2Marks.length).toFixed(1) : 0;
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
            const existingFinalMark = updatedMarks.find(item => item.type === finalMarkType);
            let finalMark = (0.3 * processMark + 0.7 * defenseMark).toFixed(1);
            if (existingFinalMark) {
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
        if (!newMark) {
            return res.status(500).json({ message: 'error' })
        } else {
            const updatedProject = await projectModel.addMark(projectId, newMark._id)
            return res.status(200).json({ updatedProject, state: 0 })
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

exports.exportToPDF = async function (req, res) {
    try {
        const htmlString = decodeURIComponent(req.body.html_data);
        const htmlToPDF = new HTMLToPDF(htmlString);
        const pdf = await htmlToPDF.convert({ waitForNetworkIdle: true, browserOptions: { defaultViewport: { width: 1920, height: 1080 } }, pdfOptions: { height: 1200, width: 900, timeout: 0 } });
        const downloadsPath = path.join(os.homedir(), 'Downloads', 'test.pdf');

        fs.writeFile(downloadsPath, pdf, (err) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ msg: "Save failed" });
            }
            res.status(200).send({ msg: "Save success", data: downloadsPath });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};