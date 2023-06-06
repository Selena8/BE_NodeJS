const express = require("express");
const db = require("../database/connection");
const { validateUserRegister } = require("../middleware/validate_User");
const { authenticate } = require("../middleware/authenticate");
const { hashPassword } = require("../helpers/hash");
const route = express.Router();
// router.put('/:id', validateUserUpdate, async function (req, res, next) {
//     const secret = process.env.SECRET
//     const id = req.params.id
//     const {name, age, gender} = req.body
//     const authorizationHeader = req.headers.authorization
//     const userToken = authorizationHeader.substring(7)
//     try {
//         const isTokenValid = jwt.verify(userToken, secret);
//         if (isTokenValid.id == id) {
//             const check = await update({
//                 db,
//                 query: "UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?",
//                 params: [
//                     name,
//                     age,
//                     gender,
//                     id
//                 ]
//             })

//             if(!check){
//                return res.status(500).json("Error : Can't update data")
//             }
//             return res.status(200).json({
//                 message: "Update successfull"
//             })
//         }
//         return res.status(401).json({
//             message: 'unauthorized',
//         });

//     } catch (error) {
//         return res.status(401).json({
//             message: error.message,
//         });
//     }

// });
// create
route.post("/create", authenticate, validateUserRegister, async (req, res) => {
    const existedUsername = await db
        .select()
        .from("users")
        .where("username", req.body.username)
        .first();
    if (!existedUsername) {
        const { salt, hashedPassword } = hashPassword(req.body.password);
        user = {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        gender: req.body.gender,
        name: req.body.name,
        age: parseInt(req.body.age),
        salt: salt,
        createAt: new Date(Date.now()),
        createBy: req.user.id,
        isAdmin: req.body.isAdmin,
        };
        await db.insert(user).into("users");
        return res.status(201).json({ message: "created successfully" });
    }
    return res.status(200).json({ message: "Error: username already exists!" });
});

// update
route.put("/:id", authenticate, async (req, res) => {
    await db("users").where("id", req.params.id).update({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        isAdmin: req.body.isAdmin,
    });
    return res.status(200).json({ message: "update successfully" });
});

// pagination, search by name
route.get("/getUsers", async (req, res) => {
    let page_size = req.query.page_size,
        page_index = req.query.page_index,
        name = req.body.name ? req.body.name : null;
    const condition = (builder) => {
        if (name) {
        builder.where("name", "like", `%${name}%`);
        }
    };
    // console.log(condition);
    var pagination = {};
    if (page_index < 1) page_index = 1;
    var offset = (page_index - 1) * page_size;
    return Promise.all([
        db.count("* as count").from("users").where(condition).first(),
        db.select("*").from("users").where(condition).offset(offset).limit(page_size),
    ]).then(([total, rows]) => {
        var count = total.count;
        var rows = rows;
        pagination.total = count;
        pagination.per_page = page_size;
        pagination.offset = offset;
        pagination.to = offset + rows.length;
        pagination.last_page = Math.ceil(count / page_size);
        pagination.current_page = page_index;
        pagination.from = offset;
        pagination.data = rows;
        res.status(200).json({ message: pagination });
    });
});
// delete
route.delete("/:id", authenticate, async (req, res) => {
    await db("users").where("id", req.params.id).del();
    return res.status(200).json({ message: "delete successfully!" });
});
module.exports = route;
/////
///////
////////