# Security Specification for ElectEd

## Data Invariants
- `QuizResult`: Stores the score of a user. Belongs to the user who took the quiz.
  - `userId` must equal `request.auth.uid`.
  - `score` must be an integer, >= 0.
  - `total` must be an integer, >= 0.
  - `createdAt` must match server timestamp.
- A user can only read their own quiz results.

## The "Dirty Dozen" Payloads
1. Create QuizResult without Auth (No user)
2. Create QuizResult for another user (`userId != auth.uid`)
3. Create QuizResult with negative score
4. Create QuizResult with string score (Wrong type)
5. Create QuizResult with oversized score (e.g., score > total or unreasonable)
6. Create QuizResult with extra fields (Ghost Field test)
7. Create QuizResult with client-provided spoofed `createdAt`
8. Update QuizResult (should be forbidden, they are immutable)
9. Delete QuizResult (should be forbidden)
10. Read another user's QuizResult (Access control leak)
11. List all QuizResults across the system (Access control leak)
12. Create QuizResult with an excessively long string in metadata context (if applicable)

## Test Runner
Defined in `firestore.rules.test.ts`.
