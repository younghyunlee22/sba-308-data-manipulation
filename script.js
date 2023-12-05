/**
 * pseudocode
 * Check if AssignmentGroup's course_id matches with the CourseInfo's id.
(AssignmentGroup.course_id, CourseInfo.id)
If false, throw an error. 

Iterate through the LearnerSubmissions array of objects.
For each learner, check what assignment(s) he/she/they submitted.
If the assignment_id of the submission doesn't exist in AssignmentGroup's assignments array of objects, log it and skip. 
I can identify each learner by learner_id key. 
I can identify each assignment by assignment_id key. 

Calculate the weighted score of each assignment.
score / points_possible (division)
score: LearnerSubmissions array, access the object by submission key, access the object by score key
points_possible: AssignmentGroup object, access the array by assignments key, access the object by iterating through the array, access the value by points_possible key 
If points_possible is 0, the calculation wouldn't work. 
If a value I am expecting to be a number is a string, convert it to a number. 

Calculate A. the sum of score earned. 
Calculate B. the sum of points_possible. 
Calculate the weighted average: A divided by B 

If an assignment is not yet due, skip that assignment when calculating score and average. 
I can identify due date by accessing AssignmentGroup objects at assignments key and from there 
iterate through the array that is the value of AssignmentGroup[assignments] to find out due date of the submitted assignment

If the learner’s submission is late (submitted_at is past due_at), deduct 10 percent of the total points possible from their score for that assignment.

Push each learner's data as an object into the result array. 

Return the result array.
 */

// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

// =======================

function isValidCourse(courseInfo, assignmentGroup) {
  try {
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error(
        "Invalid input: The assignment group you entered is not part of the course you indicated."
      );
    }
  } catch (err) {
    console.log(err);
  }
}
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
  try {
    isValidCourse(courseInfo, assignmentGroup);

    const result = [];

    // Iterate through LearnerSubmissions array of objects

    for (const submission of learnerSubmissions) {
      const learnerId = submission.learner_id;
      const assignmentId = submission.assignment_id;

      const assignment = assignmentGroup.assignments.find(
        (a) => a.id === assignmentId
      );

      // Now 'assignment' contains the assignment with the specified 'assignmentId'
      // console.log(assignment);

      // If assignment not found, log it and skip.
      if (!assignment) {
        console.log(
          `No assignment with ID ${assignmentId} found in AssignmentGroup. Skipping.`
        );
        continue;
      }

      // destructuring submitted_at and score
      const { submitted_at, score } = submission.submission;

      // date comparison
      const dueDate = new Date(assignment.due_at);

      // Check if assignment is not yet due
      // if dueDate is greater than current date created by new Date()
      if (dueDate > new Date()) {
        console.log(
          `Assignment with ID ${assignmentId} is not yet due. Skipping.`
        );
        continue;
      }

      const possiblePoints = assignment.points_possible;

      // if submission is late, deduct 10%
      const isLate = new Date(submitted_at) > dueDate; // boolean
      const lateSubmissionDeduction = isLate ? 0.1 * possiblePoints : 0;

      const finalScore = score - lateSubmissionDeduction;
      // Calculate the weighted score
      let weightedScore = 0;

      if (possiblePoints > 0) {
        weightedScore = finalScore / possiblePoints;
      } else {
        throw new Error("Possible points must be greater than 0");
      }
      // Initialize learner object if not exists
      if (!result.find((learner) => learner.id === learnerId)) {
        result.push({
          id: learnerId,
          avg: 0,
        });
      }

      // Update learner data
      const learnerData = result.find((learner) => learner.id === learnerId);
      learnerData[assignmentId] = weightedScore;

      // Calculate final averages as you go
      const numAssignments = Object.keys(learnerData).length - 2; // Subtracting 'id' and 'avg'
      let totalFinalScore = 0;
      let totalPointsPossible = 0;

      // Iterate through each assignment in learnerData
      for (const assignmentId in learnerData) {
        if (assignmentId !== "id" && assignmentId !== "avg") {
          const score = learnerData[assignmentId];

          // Find the corresponding assignment in AssignmentGroup
          const assignment = assignmentGroup.assignments.find(
            (a) => a.id === parseInt(assignmentId)
          );

          if (assignment) {
            totalFinalScore += score * assignment.points_possible;
            totalPointsPossible += assignment.points_possible;
          }
        }
      }

      // Update the average based on the sum of actual final scores and sum of points_possible
      learnerData.avg =
        totalPointsPossible > 0 ? totalFinalScore / totalPointsPossible : 0;
    }

    return result;
  } catch (err) {
    console.log(err);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);

/*
expected result is like the following:
[
  {
    id: 125,
    avg: 0.985, // (47 + 150) / (50 + 150)
    1: 0.94, // 47 / 50
    2: 1.0, // 150 / 150
  },
  {
    id: 132,
    avg: 0.82, // (39 + 125) / (50 + 150)
    1: 0.78, // 39 / 50
    2: 0.833, // late: (140 - 15) / 150
  },
]
 */
