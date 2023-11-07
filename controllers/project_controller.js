const projectModel = require('../schema/Project_schema')
const userModel = require('../schema/User_schema')
const mongoose=require('mongoose') 




//todo ______get projects
exports.getProject = async (req, res) => {
  const  {email}  = req.params
  console.log("-",email)
  try { 
    const userExist = await userModel.findOne({ email }).populate("projects")
    if (!userExist) { return res.json({ "message": "user not available ", success: false }) }
    else {
            console.log(userExist.projects)
      return res.json({ message: " Project Fetched Successfully", success: true, 
      projects: userExist.projects
     })
    } 
  } catch (error) {
    console.log("catch bloack active due to__", error)
    return res.json({message:error.message.split(': ')[2]})
  }
}




//todo ______adding projects
exports.addProject = async (req, res) => {
  try {
    console.log(req.body)
    const { title, live, github, description, user } = req.body

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.json({
        message: "Invalid user ID",
        success: false,
      });
    }

    const existingUser = await userModel.findById(user)
    console.log("the existing user is :",existingUser)
    if (!existingUser) {
      return res.json({
        message: "User does not exist",
        success: false,
      })  
    } 
    else { 
      const existingProject = await projectModel.findOne({ title, user })
      console.log(existingProject ? existingProject.title : "")
      if (existingProject) {
        return res.json({ message: "project with similar title already exist in your collection", success: false })
      }
      const saveProject = new projectModel({ title, live, github, description, user })
      await saveProject.save()
      await existingUser.projects.push(saveProject._id)
      await existingUser.save()
      return res.json({ message: "project added successfully in your collection", success: true, })
    }
  } catch (error) {
    console.log("catch bloack active due to__", error)
    console.log("error is ",error)
    // return res.json({message:"it is an error"+error})
   return res.json({message:error.message.split(': ')[2]})
  }
}




//todo ______deleting projects
exports.deleteProject = async (req, res) => {
  console.log(req.params)
  try {
    const { title, user } = req.params
    const del_projectTitle = await projectModel.findOneAndDelete({ title, user }).populate("user")
    if (del_projectTitle) {
      await del_projectTitle.user.projects.pull(del_projectTitle)
      await del_projectTitle.user.save()
      return res.json({ message: "project was successfully deleted", success: true })
    }
    else {
      return res.json({ message: "project with given title not available in database" })
    }
  } catch (error) {
    console.log("catch bloack active due to__", error)
    return res.json(`catch bloack active due to__${error}`)
  }
}

//todo ______update projects
exports.updateProject = async (req, res) => {
  try {
    const { title, live, github, description, project_id, user } = req.body
    const existingUser = await userModel.findById(user)
    if (!existingUser) {
      return res.json({ message: "user does not exist inside database", success: false })
    }
    else {
      const findProject = await projectModel.findById(project_id).populate("user")
      // console.log("find_",findProject)
      const updateProject = await projectModel.findByIdAndUpdate(project_id, { title, live, github, description }, { new: true }).exec()
      // console.log("update_",updateProject)
      await updateProject.save()
      return res.json({ message: "updation successful", success: true, })
    }

  } catch (error) {
    console.log("catch bloack active due to__", error)
    return res.json(`catch bloack active due to__${error}`)
  }
}




