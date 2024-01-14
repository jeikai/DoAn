const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    projectName: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    type: { type: Number, enum: [0, 1], required: true, default: 0},
    description: {type: String, required: true},
    isApproved: {type: Boolean, default: false},
    isDenied: {type: Boolean, default: false},
    listMark: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mark'}],
    date_created: Date,
    deadline: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
})

const Project = mongoose.model('Project', ProjectSchema, 'projects')
exports.schema = Project

exports.create = async function(userId, project){
    const data = {
        projectName: project.projectName,
        userId: userId,
        type: project.type,
        description: project.description,
        date_created: new Date()
    } 
    const newProject = Project(data)
    await newProject.save()
    return newProject
}

exports.get = async function(userId, projectId){
    const projects = await Project.find({userId: userId})
    if (projectId){
        const project = projects.filter((item) => item._id == projectId)
        return project
    }
    return projects
}

exports.getCountProject = async function(userId){
    try {
        const count = await Project.countDocuments({ userId: userId });
        return count;
    } catch (error) {
        throw error;
    }
}

exports.update = async function(projecyId,data){
    try{
        const project = await Project.findByIdAndUpdate(projecyId, data)
        const result = await Project.findById(project._id)
        return result
    }catch(err){
        return err
    }
}

exports.delete = async function(projectId){ 
    try{
        const result = await Project.findByIdAndDelete(projectId)
        return result
    }catch(err){
        return err
    }
}

exports.addMark = async function(projectId, markId){
    try{
        const project = await Project.findById(projectId)
        project.listMark.push(markId)
        project.markModified('listMark')
        await project.save()
        return project
    }catch(err){
        return err
    }
}

exports.listMark = async function(projectId){
    try{
        debugger
        const project = await Project.findById(projectId).populate('listMark')
        const marks = project.listMark
        return marks
    }catch(err){
        return err
    }
}

exports.getProjectByUserIdAndType = async function(userId, type) {
    try {
        const project = await Project.findOne({ userId, type });
        return project;
    } catch (error) {
        throw error;
    }
};

exports.getApprovedProjectsByUserId = async function(userId) {
    try {
        const projects = await Project.find({ userId, isApproved: true });
        return projects;
    } catch (error) {
        throw error;
    }
};