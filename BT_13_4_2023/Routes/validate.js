function validate(req, res, next) {
    const name = req.body.name
    const age = req.body.age
    if(age < 0) {
        return res.status(404).json({"message": "Hay nhap lai tuoi!"})
    }
    else if(!/^[a-zA-Z ]+$/.test(name)) {
        return res.status(404).json({"message": "Hay nhap lai ten!"})
    }
    next()
}
module.exports = validate;