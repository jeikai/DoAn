const classModel = require('../models/Class')
const utility = require('../helper/utility')

exports.create = async function(req, res){
    try{
        const data = req.body
        const classes = await classModel.get()
        const checkClass = classes.filter(item => item.className === data.className)
        if (checkClass.length > 0 ) {
            return res.status(422).json({message: 'This class existed'})
        }
    
        const newClass = await classModel.create(data)
        if(!newClass){
            return res.status(500).json({message: 'error'})
        }

        return res.status(200).json(newClass)

    }catch(e){
        return res.status(500).json({message: e})
    }
}

exports.addUser = async function(req, res){ 
    try{
        const data = req.body
        const classId = req.params.classId
        const result = await classModel.addUser(classId, data.data)
        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e})
    }
}

exports.listUser = async function(req,res){
    try{
        const classId = req.params.classId
        const users = await classModel.listUser(classId)
        return res.status(200).json(users)
    }catch(e){
        return res.status(500).json({message: e})
    }
}

exports.getAllClass = async function (req, res) {
    try {
        const classes = await classModel.getAll();
        return res.status(200).json(classes);
    } catch (e) {
        return res.status(500).json({ message: e });
    }
};

exports.deleteClass = async function (req, res) { 
    try {
        const classId = req.params.classId;
        const result = await classModel.delete(classId);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(500).json({ message: e });
    }
}

exports.getDetail = async function (req, res) {
    try {
        const classId = req.params.classId;
        const result = await classModel.getDetail(classId)
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e });
    }
}

exports.update = async function (req, res) {
    try {
        const classId = req.params.classId;
        const data = req.body;
        const result = await classModel.update(classId, data);
        return res.status(200).json(result)
    } catch (e) {
        return res.status(500).json({ message: e });
    }
}