const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MarkSchema = new Schema({
    mark: {type: Number, required: true, default: 0},
    type: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true},
    // 0 là hướng dẫn, 1 là thực hiện, 2 là bảo vệ và 3 là quá trình, 4 là tổng điểm bảo vệ, 5 là điểm tổng kết
    teacherId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: ''},
    comment: { type: String, default: ''},
    date_created: Date
}) 

const Mark = mongoose.model('Mark', MarkSchema, 'marks')
exports.schema = Mark

exports.create = async function(teacherId,mark){
    const data = {
        mark: mark.mark,
        type: mark.type, 
        teacherId: teacherId,
        comment: mark.comment,
        date_created: new Date()
    }
    const newMark = Mark(data)
    await newMark.save()
    return newMark
} 

exports.get = async function(markId){
    try{
        const mark = await Mark.findById(markId)
        return mark
    }catch(err){
        return err
    }
}

exports.update = async function(markId,data){
    try{
        const mark = await Mark.findByIdAndUpdate(markId, data)
        const result = await Mark.findById(mark._id)
        return result
    }catch(err){
        return err
    }
}
