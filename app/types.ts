export type Question = {
    question: string,
    correctAnswer: string,
}

export type Language = "en" | "dk";

export type Settings = {
    language: Language
}

export type Quizz = Question[]