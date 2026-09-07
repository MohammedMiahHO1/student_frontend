const express = require("express");


const {
    getAllStudents, createStudentWithSubject
} = require("../controller/studentService");

const studentService = require("../controller/studentService");

const router = express.Router();



router.post("/students/:id/edit-subject", async (req, res) => {

    try {

        const studentId = req.params.id;

        const {
            studentSubjectId,
            subject,
            grade
        } = req.body;
        console.log({
            studentId,
            studentSubjectId,
            subject,
            grade
        });

        await studentService.updateStudentSubject(
            Number(studentId),
            Number(studentSubjectId),
            subject,
            Number(grade)
        );

        res.redirect(`/students/${studentId}`);

    } catch (error) {

        console.error(error);

        res.status(500)
            .send("Something went wrong");
    }
});

router.get("/students/:id/edit", async (req, res) => {

    try {

        const studentId = req.params.id;

        const student =
            await studentService.getStudentById(studentId);

        if (!student) {
            return res.status(404)
                .send("Student not found");
        }

        res.render("editStudent.njk", {
            student
        });

    } catch (error) {

        console.error(error);

        res.status(500)
            .send("Something went wrong");
    }
});


router.get("/students/add", async (req, res) => {
    res.render("addStudent.njk");
});


router.get("/students/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        const student =
            await studentService.getStudentById(id);

        if (!student) {
            return res.status(404)
                .send("Student not found");
        }

        res.render("studentDetails.njk", {
            student
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Unable to retrieve student"
        );
    }
});

router.get("/students", async (req, res) => {

    try {

        const students = await getAllStudents();

        res.render("students", {
            students
        });

    } catch (error) {
        console.error(error);

        res.status(500).send("Unable to retrieve students");
    }
});


router.post("/students", async (req, res) => {

    try {

        const {
            name,
            branch,
            percentage,
            subject,
            grade
        } = req.body;

        console.log("Form data:", req.body);
        await studentService.createStudentWithSubject({
            name,
            branch,
            percentage: Number(percentage),
            subject,
            grade: Number(grade)
        });
        res.redirect("/students");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Unable to create student"
        );
    }
});




module.exports = router;