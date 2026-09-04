const axios = require("axios");
require('dotenv').config();

const JAVA_API_URL = "http://localhost:8080/graphql";


async function getAllStudents() {


    const query = `
    query {
      getAllStudents {
        rollNo
        name
        percentage
        branch
        subjects {
          id
          grade
          subject {
            id
            name
          }
        }
      }
    }
  `;

    const response = await axios.post(JAVA_API_URL, {
        query
    });

    if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data.data.getAllStudents;

}


async function createStudentWithSubject(
    name,
    percentage,
    branch,
    subject,
    grade
) {

    const mutation = `
        mutation CreateStudentWithSubject(
            $name: String!
            $percentage: Float!
            $branch: String!
            $subject: String!
            $grade: Float!
        ) {
            createStudentWithSubject(
                name: $name
                percentage: $percentage
                branch: $branch
                subject: $subject
                grade: $grade
            ) {
                rollNo
                name
                percentage
                branch
                subjects {
                    id
                    grade
                    subject {
                        id
                        name
                    }
                }
            }
        }
    `;

    const response = await axios.post(JAVA_API_URL, {
        query: mutation,
        variables: {
            name,
            percentage,
            branch,
            subject,
            grade
        }
    });

    if (response.data.errors) {
        throw new Error(
            response.data.errors[0].message
        );
    }

    return response.data.data.createStudentWithSubject;
}

//
// async function createStudent(name, percentage, branch) {
//
//
//
//     const mutation = `
//         mutation CreateStudent(
//             $name: String!
//             $percentage: Float!
//             $branch: String!
//         ) {
//             createStudent(
//                 name: $name
//                 percentage: $percentage
//                 branch: $branch
//             ) {
//                 rollNo
//                 name
//                 percentage
//                 branch
//             }
//         }
//     `;
//
//     const response = await axios.post(GRAPHQL_URL, {
//         query: mutation,
//         variables: {
//             name,
//             percentage,
//             branch
//         }
//     });
//
//     if (response.data.errors) {
//         throw new Error(
//             response.data.errors[0].message
//         );
//     }
//
//     return response.data.data.createStudent;
// }
//
// async function createSubject(name) {
//
//     const mutation = `
//         mutation CreateSubject($name: String!) {
//             createSubject(name: $name) {
//                 id
//                 name
//             }
//         }
//     `;
//
//     const response = await axios.post(
//         GRAPHQL_URL,
//         {
//             query: mutation,
//             variables: {
//                 name
//             }
//         }
//     );
//
//     if (response.data.errors) {
//         throw new Error(
//             response.data.errors[0].message
//         );
//     }
//
//     return response.data.data.createSubject;
// }
//
// async function addSubjectToStudent(
//     studentId,
//     subjectId,
//     grade
// ) {
//
//     const mutation = `
//         mutation AddSubjectToStudent(
//             $studentId: ID!
//             $subjectId: ID!
//             $grade: Float!
//         ) {
//             addSubjectToStudent(
//                 studentId: $studentId
//                 subjectId: $subjectId
//                 grade: $grade
//             ) {
//                 id
//                 grade
//                 subject {
//                     id
//                     name
//                 }
//             }
//         }
//     `;
//
//     const response = await axios.post(GRAPHQL_URL, {
//         query: mutation,
//         variables: {
//             studentId,
//             subjectId,
//             grade
//         }
//     });
//
//     if (response.data.errors) {
//         throw new Error(
//             response.data.errors[0].message
//         );
//     }
//
//     return response.data.data.addSubjectToStudent;
// }

module.exports = {
    createStudentWithSubject, getAllStudents
}