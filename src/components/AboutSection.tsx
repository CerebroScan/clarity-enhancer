import { Brain, GraduationCap, Users, AlertTriangle, CheckCircle2, Info, Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  linkedIn: string;
  initials: string;
}

const teamMembers: TeamMember[] = [
  { name: "Fatma Al-Zahraa Emad", linkedIn: "https://www.linkedin.com/in/fatma-al-zahraa-emad-326b64234/", initials: "FE" },
  { name: "Gehad Mohamed", linkedIn: "https://www.linkedin.com/in/gehad-mohamed-2a4946252/", initials: "GM" },
  { name: "Youssef Mostafa", linkedIn: "https://www.linkedin.com/in/youssef-mostafa-6ab6b224b/", initials: "YM" },
  { name: "Mohamed Asem", linkedIn: "https://www.linkedin.com/in/mohamed-asem-73b0b9220/", initials: "MA" },
  { name: "Luai Badr", linkedIn: "https://www.linkedin.com/in/luai-badr-02b40421a/", initials: "LB" },
];

export function AboutSection() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* About Card */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">About CerebroScan</h2>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              CerebroScan is an <span className="text-foreground font-medium">educational demonstration tool</span> for 
              Alzheimer's disease stage classification using deep learning analysis of brain MRI scans. 
              This project showcases how AI can assist in identifying patterns associated with different 
              stages of cognitive impairment.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-foreground">What It Does</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Analyzes brain-only MRI slices</li>
                  <li>• Classifies into 4 stages: Normal, Very Mild, Mild, Moderate Dementia</li>
                  <li>• Provides confidence scores for each prediction</li>
                  <li>• Reports "Uncertain" when confidence is low</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <h3 className="font-semibold text-foreground">Important Disclaimer</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• For educational purposes only</li>
                  <li>• Not intended for clinical diagnosis</li>
                  <li>• Always consult healthcare professionals</li>
                  <li>• Results should be verified by experts</li>
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-accent/50">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">How It Works</h3>
              </div>
              <p className="text-sm leading-relaxed">
                The system uses a convolutional neural network (CNN) trained on the Alzheimer's MRI dataset. 
                When you upload a brain MRI image, the model analyzes structural patterns and outputs 
                probability scores for each classification stage. When the highest probability is below 
                a confidence threshold, the system flags the result as <span className="font-medium text-warning">"Uncertain"</span> and 
                allows you to view all prediction probabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Supervision Card */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Academic Supervision</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-muted/50">
              <h3 className="font-bold text-foreground text-lg mb-1">Prof. Muhammad Sayed Hammad</h3>
              <p className="text-sm text-muted-foreground">Project Supervisor</p>
            </div>
            <div className="p-5 rounded-xl bg-muted/50">
              <h3 className="font-bold text-foreground text-lg mb-1">Eng. Heidi Ahmed</h3>
              <p className="text-sm text-muted-foreground">Teaching Assistant</p>
            </div>
          </div>
        </div>

        {/* Team Card */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Development Team</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <a
                key={member.name}
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  <div className="team-photo w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center text-2xl md:text-3xl font-bold text-primary">
                    {member.initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Linkedin className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <span className="font-semibold text-foreground text-sm md:text-base group-hover:text-primary transition-colors">
                  {member.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
