"use client";

import { useState } from "react";
import { ProgramCard } from "../../components/ProgramSelector/ProgramCard";
import { QuizModal } from "../../components/ProgramSelector/QuizModal";
import { RecommendedBanner } from "../../components/ProgramSelector/RecommendedBanner";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { motion } from "motion/react";
import {
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Code,
  Palette,
  Rocket,
  ArrowLeft,
  CheckCircle2,
  Star,
  Clock,
  Globe,
} from "lucide-react";

export default function ProgramSelector({
  pathType,
  onBack,
  onSelectProgram,
  onSignUp,
}: any) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [recommendedProgram, setRecommendedProgram] = useState<string | null>(
    null
  );
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const programs = [
    {
      id: "nia-empowerment",
      name: "NIA Empowerment Academy",
      icon: Users,
      tagline: "Build confidence and essential life skills",
      description:
        "A transformative six-week program offered in Fall, Spring, and Summer. Focuses on career development, college preparation, career exposure, scholarships, AI development, and more. Interactive workshops and inspiring mentorship help students succeed academically and personally.",
      duration: "6 weeks",
      commitment: "Varies per session",
      ageRange: "Girls of all ages",
      benefits: [
        "Confidence building workshops",
        "College prep guidance",
        "Career exposure and mentoring",
        "Scholarship support",
        "AI and tech development",
      ],
      bestFor: [
        "Students looking to build confidence",
        "Girls interested in career and academic growth",
        "Those seeking mentorship and skill development",
      ],
      color: "purple",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      id: "ujima-business",
      name: "UJIMA Business Program",
      icon: Rocket,
      tagline: "Entrepreneurship experience for young innovators",
      description:
        "Semester-long program for elementary and middle school students. Students create their own innovative businesses, develop business plans, pitch ideas, and compete in an annual pitch competition.",
      duration: "Semester-long",
      commitment: "2-4 hours/week",
      ageRange: "Elementary & Middle School",
      benefits: [
        "Business plan development",
        "Pitch coaching",
        "Annual pitch competition",
        "Entrepreneurial mentorship",
        "Prizes for top projects",
      ],
      bestFor: [
        "Young aspiring entrepreneurs",
        "Students interested in business and innovation",
        "Leadership-minded students",
      ],
      color: "blue",
      gradient: "from-blue-500 to-indigo-700",
    },
    {
      id: "kumbathon",
      name: "KUMBATHON",
      icon: GraduationCap,
      tagline: "Annual STEM hackathon for girls",
      description:
        "Our annual hackathon, partnered with Girls Who Code, where students choose a STEM theme, solve real-world problems, and develop tech solutions in a collaborative environment.",
      duration: "Annual (March)",
      commitment: "Event-based",
      ageRange: "Girls of all ages",
      benefits: [
        "STEM problem-solving",
        "Collaborative team projects",
        "Hands-on tech development",
        "Mentorship from STEM professionals",
        "Exposure to Girls Who Code curriculum",
      ],
      bestFor: [
        "Students interested in STEM",
        "Girls who love collaborative challenges",
        "Tech and innovation enthusiasts",
      ],
      color: "green",
      gradient: "from-green-500 to-teal-600",
    },
    {
      id: "nia-global-youth",
      name: "NIA Global Youth Academy",
      icon: Globe,
      tagline: "Connect globally with peers and projects",
      description:
        "Virtual exchange program connecting students globally, including Ghana, Liberia, Guyana, and more. Participants collaborate on projects, experience cultural immersion, and build lifelong friendships.",
      duration: "Ongoing",
      commitment: "Varies",
      ageRange: "Girls of all ages",
      benefits: [
        "Global peer collaboration",
        "Cultural immersion experiences",
        "Virtual projects and exchanges",
        "Community building with international students",
        "Global networking opportunities",
      ],
      bestFor: [
        "Students interested in global connections",
        "Girls who want cross-cultural experiences",
        "Those seeking international collaboration",
      ],
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const quizQuestions = [
    {
      id: "q1",
      question: "What are you most interested in?",
      options: [
        {
          value: "mentorship",
          label: "Getting personal guidance",
          programs: ["ujima"],
        },
        {
          value: "handson",
          label: "Hands-on activities and projects",
          programs: ["afterschool", "stem", "arts"],
        },
        {
          value: "business",
          label: "Building something entrepreneurial",
          programs: ["entrepreneurship"],
        },
        {
          value: "leading",
          label: "Leading and inspiring others",
          programs: ["leadership"],
        },
      ],
    },
    {
      id: "q2",
      question: "How much time can you commit weekly?",
      options: [
        { value: "1-2", label: "1-2 hours", programs: ["ujima"] },
        {
          value: "2-4",
          label: "2-4 hours",
          programs: ["afterschool", "arts", "leadership"],
        },
        {
          value: "3-6",
          label: "3-6 hours",
          programs: ["entrepreneurship", "stem"],
        },
      ],
    },
    {
      id: "q3",
      question: "What type of learning do you prefer?",
      options: [
        {
          value: "onetoone",
          label: "One-on-one guidance",
          programs: ["ujima"],
        },
        {
          value: "group",
          label: "Group activities and collaboration",
          programs: ["afterschool", "stem", "arts", "leadership"],
        },
        {
          value: "project",
          label: "Working on my own projects",
          programs: ["entrepreneurship", "stem", "arts"],
        },
      ],
    },
  ];

  const handleQuizSubmit = () => {
    const programScores: Record<string, number> = {};

    Object.values(quizAnswers).forEach((answerId) => {
      const question = quizQuestions.find((q) =>
        q.options.some((opt) => opt.value === answerId)
      );
      const option = question?.options.find((opt) => opt.value === answerId);

      option?.programs.forEach((programId) => {
        programScores[programId] = (programScores[programId] || 0) + 1;
      });
    });

    const topProgram = Object.entries(programScores).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    setRecommendedProgram(topProgram || "ujima");
    setShowQuiz(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journey
          </Button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl mb-4">
              🎉 Great Job Completing Your Journey!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {pathType === "student"
                ? "Now let's find the perfect program to start your IGA experience!"
                : "Now let's find the best way for you to contribute as a volunteer!"}
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Take Quiz - Find My Match 🎯
              </Button>
              <Button variant="outline">Browse All Programs</Button>
            </div>
          </div>
        </div>

        <QuizModal
          open={showQuiz}
          questions={quizQuestions}
          answers={quizAnswers}
          onChange={(q, v) => setQuizAnswers((prev) => ({ ...prev, [q]: v }))}
          onClose={() => setShowQuiz(false)}
          onSubmit={handleQuizSubmit}
        />

        {recommendedProgram && (
          <RecommendedBanner
            programName={
              programs.find((p) => p.id === recommendedProgram)?.name || ""
            }
          />
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <ProgramCard
              key={program.id}
              program={program}
              recommended={recommendedProgram === program.id}
              selected={selectedProgram === program.id}
              onSelect={(id) => setSelectedProgram(id)}
            />
          ))}
        </div>

        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl mb-4">Program Selected!</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                You've selected{" "}
                <strong>
                  {programs.find((p) => p.id === selectedProgram)?.name}
                </strong>
                . Check your email for next steps, or continue exploring IGA!
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={onBack}>
                  Explore More
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
