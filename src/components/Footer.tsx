export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-slate-100 text-lg font-semibold mb-3">
              📚 CampusShare
            </h3>
            <p className="text-sm">
              The premier platform for students to share and discover academic
              resources across campuses.
            </p>
          </div>
          <div>
            <h4 className="text-slate-100 text-sm font-semibold mb-3 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Notes</li>
              <li>Question Papers</li>
              <li>Solutions</li>
              <li>Project Reports</li>
              <li>Study Material</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-100 text-sm font-semibold mb-3 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Built with Next.js</li>
              <li>Prisma ORM + SQLite</li>
              <li>NextAuth Authentication</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm">
          <p>
            © 2026 CampusShare. Built for the Hackathon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
