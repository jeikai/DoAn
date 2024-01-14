const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClassSchema = new Schema({
    className: { type: String, required: true },
    teacherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    listUser: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    examinationBoard: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    date_created: Date
})

const Class = mongoose.model('Class', ClassSchema, 'classes')
exports.schema = Class

exports.create = async function(data){
    const dataClass = {
        className : data.className,
        listUser : data.listUser || [],
        teacherId : data.teacherId,
        examinationBoard : data.examinationBoard || []
    }
    const newClass = Class(dataClass)
    await newClass.save()
    return newClass  
}

exports.get = async function(classId){
    if(classId){
        const classData = await Class.findById(classId).exec()
        return classData
    }else{
        const classes = await Class.find()
        return classes
    }
}

exports.getDetail = async function(classId){
    if(classId){
        const classData = await Class.findById(classId)
        .populate('teacherId')
        .populate('listUser')
        .populate('examinationBoard');
        return classData
    }else{
        const classes = await Class.find()
        return classes
    }
}

exports.update = async function(classId,data){
    try{
        const classData = await Class.findByIdAndUpdate(classId, data)
        const result = await Project.findById(classData._id)
        return result
    }catch(err){
        return err
    }
}

exports.delete = async function(classId){
    try{
        const result = await Class.findByIdAndDelete(classId)
        return result
    }catch(err){
        return err
    }
}

exports.addUser = async function(classId, data){
    try{
        const classData = await Class.findById(classId)
        classData.listUser.push(...data)
        classData.markModified('listUser')
        await classData.save()
        return classData
    }catch(err){
        return err
    }
}

exports.listUser = async function(classId){
    try{
        debugger
        const classData = await Class.findById(classId).populate('listUser')
        return classData.listUser
    }catch(err){
        return err
    }
}

exports.getAll = async function () {
    try{
        const classes = await Class.find({});
        return classes;
    }catch(err){
        return err
    }
}