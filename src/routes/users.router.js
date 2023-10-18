const { Router } = require('express');
const { userModel } = require('../dao/models/users.model');

const router = Router();

/*GET*/
router.get('/', async (req, res) => {
    try {
        let users = await userModel.find();
        res.send({ result:"success", payload:users })
    } catch (error) {
        console.log(error)
    }
})
/*POST*/
router.post('/', async (req, res) => {
    let { first_name, last_name, email } = req.body;
    if(!first_name || !last_name || !email){
        res.send({ status: "error", error: "Faltan datos" })
    }
    let result = await userModel.create({ first_name, last_name, email })
    res.send({ status: "success", payload: result })
})
/*UPDATE*/
router.put('/:uid', async (req, res) => {
    let { uid } = req.params;
    let userToReplace = req.body;
    if(!userToReplace.first_name || !userToReplace.last_name || !userToReplace.email){
        res.send({ status: "error", error: "No hay datos en los parámetros" })
    }
    let result = await userModel.updateOne({ _id: uid }, userToReplace)
    res.send({ status: "success", payload: result })
})
/*DELETE*/
router.delete('/:uid', async (req, res) => {
    let { uid } = req.params;
    let result = await userModel.deleteOne({ _id: uid })
    res.send({ status: "success", payload: result })
})

module.exports = router;