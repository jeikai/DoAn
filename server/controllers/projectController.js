const projectModel = require('../models/Project')
const utility = require('../helper/utility')

exports.addProject = async function(req, res){
    const data = req.body;
    utility.validate(data, ['projectName', 'description']);
    const userId = req.params.userId;

    try {
        // Kiểm tra xem đã có project nào với userId và type tương ứng chưa
        const existingProject = await projectModel.getProjectByUserIdAndType(userId, data.type);

        if (existingProject && !existingProject.isDenied) {
            return res.status(400).json({ message: 'Project with the same userId and type already exists.' });
        }

        // Nếu chưa có, thì tạo mới project
        const newProject = await projectModel.create(userId, data);
        
        if(!newProject){ 
            return res.status(500).json({ message: 'Error creating project.' });
        }    

        return res.status(200).json(newProject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
};

exports.listProject = async function(req, res){
    const userId = req.params.userId
    const projects = await projectModel.get(userId)
    if(!projects){
        return res.status(401).json({message: "not found"})
    }
    return res.status(200).json(projects)

}

exports.getProject = async function(req, res){
    const userId = req.params.userId
    const projectId = req.params.projectId 

    const project = await projectModel.get(userId, projectId)
    if(!project){
        return res.status(404).json({message: "not found"})
    }
    return res.status(200).json(project)
}

exports.updateProject = async function(req, res){
    const projectId = req.params.projectId
    const data = req.body
    try{
        const result = await projectModel.update(projectId, data)
        return res.status(200).json(result)
    }catch(err){
        return res.status(404).json({msg: 'error', data: err})
    }
} 

exports.deleteProject = async function(req, res){
    const projectId = req.params.projectId
    try{
        const result = await projectModel.delete(projectId)
        if(result === null){
        return res.status(404).json({msg: 'error', data: result})
        }
        return res.status(200).json({msg: 'success', data: result})
    }catch(err){
        return res.status(404).json({msg: 'error', data: err})
    }
}
