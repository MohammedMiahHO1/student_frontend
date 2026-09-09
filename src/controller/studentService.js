const axiosAPI = require("../controller/queryHelpers");

const {cacheService,deleteCache} = require('../cache/cacheService');


async function updateStudentSubject(
    studentId,
    studentSubjectId,
    subject,
    grade
) {

    const updatedStudentSubject = await axiosAPI.updateStudentSubject(
        studentSubjectId,
        subject,
        grade
    );
    await deleteCache(`student:${studentId}`);

    return updatedStudentSubject;
}

async function getStudentById(id) {

    return cacheService(
            `student:${id}`,
            120,
            () => axiosAPI.getStudentById(id)
        );
}

async function getAllStudents() {

    return cacheService(
        "students:all",
        120,
        () => axiosAPI.getStudentById(id)
    );


}

async function createStudentWithSubject({
                                            name,
                                            branch,
                                            percentage,
                                            subject,
                                            grade
                                        }) {


    const student = await  axiosAPI.createStudentWithSubject(
        name,
        percentage,
        branch,
        subject,
        grade
    );

    await deleteCache("students:all");
    return student

}


module.exports = {
    createStudentWithSubject, getAllStudents,getStudentById, updateStudentSubject
};