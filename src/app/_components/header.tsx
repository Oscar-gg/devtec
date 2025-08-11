"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Dropdown } from "./dropdown";
import { ProfileIcon, LogoutIcon, GitHubIcon } from "./icons";

export const Header = () => {
  const [activeTab, setActiveTab] = useState<
    "projects" | "developers" | "organizations"
  >("projects");

  const session = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#1E1E1E]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <h1 className="text-xl font-bold text-white">DevTec</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation Tabs */}
            <div className="flex rounded-lg bg-[#121212] p-1">
              <button
                onClick={() => setActiveTab("projects")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === "projects"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("developers")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === "developers"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Developers
              </button>
              <button
                onClick={() => setActiveTab("organizations")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === "organizations"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Organizations
              </button>
            </div>

            {session.data ? (
              <Dropdown
                trigger={
                  <div className="rounded-full focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:outline-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.data?.user?.image ?? "/default-avatar.png"}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full border border-gray-600 object-cover transition-colors duration-200 hover:border-[#8B5CF6]"
                    />
                  </div>
                }
                items={[
                  {
                    label: "Profile",
                    icon: <ProfileIcon />,
                    onClick: () => {
                      // Navigate to profile - you can implement this later
                      console.log("Navigate to profile");
                    },
                  },
                  {
                    label: "Log out",
                    icon: <LogoutIcon />,
                    onClick: () => {
                      void signOut();
                    },
                  },
                ]}
              />
            ) : (
              <button
                onClick={() => signIn("github")}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-[#121212] px-4 py-2 text-sm font-medium text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#1E1E1E] hover:shadow-lg hover:shadow-[#8B5CF6]/20"
              >
                <GitHubIcon />
                Log in with GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
