"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Dropdown } from "./dropdown";
import {
  ProfileIcon,
  LogoutIcon,
  GitHubIcon,
  MenuIcon,
  CloseIcon,
} from "./icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { profilePicture } from "~/utils/frontend/defaultProfilePicture";
import { useSection } from "../_hooks/section";
import { useState } from "react";

const sectionRoutes: Record<string, string> = {
  projects: "/",
  developers: "/developers",
  organizations: "/organizations",
};

export const Header = () => {
  const session = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { activeSection } = useSection();

  const navigateToSection = (section: string) => {
    if (sectionRoutes[section] && activeSection !== sectionRoutes[section]) {
      router.push(sectionRoutes[section]);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#1E1E1E]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <h1 className="text-xl font-bold text-white">DevTec</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Navigation Tabs */}
            <div className="flex rounded-lg bg-[#121212] p-1">
              <button
                onClick={() => navigateToSection("projects")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === "projects"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => navigateToSection("developers")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === "developers"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Developers
              </button>
              <button
                onClick={() => navigateToSection("organizations")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === "organizations"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Organizations
              </button>
            </div>

            {/* User Actions */}
            {session.data ? (
              <Dropdown
                trigger={
                  <div className="flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:outline-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profilePicture({
                        image: session.data?.user?.image,
                        name: session.data?.user?.name,
                      })}
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
                      router.push(`/developers/profile`);
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
                <span className="hidden sm:inline">Log in with GitHub</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile User Actions */}
            {session.data ? (
              <div className="flex items-center">
                <Dropdown
                  trigger={
                    <div className="flex h-8 w-8 items-center justify-center rounded-full focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:outline-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profilePicture({
                          image: session.data?.user?.image,
                          name: session.data?.user?.name,
                        })}
                        alt="User Avatar"
                        className="h-8 w-8 rounded-full border border-gray-600 object-cover transition-colors duration-200 hover:border-[#8B5CF6]"
                      />
                    </div>
                  }
                  items={[
                    {
                      label: "Profile",
                      icon: <ProfileIcon />,
                      onClick: () => {
                        router.push(`/developers/profile`);
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
              </div>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-600 bg-[#121212] px-3 py-2 text-xs font-medium text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#1E1E1E]"
              >
                <GitHubIcon className="h-4 w-4" />
                Login
              </button>
            )}

            <button
              onClick={toggleMobileMenu}
              className="rounded-lg border border-gray-600 bg-[#121212] p-2 text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#1E1E1E]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col gap-2 rounded-lg bg-[#121212] p-4">
              <button
                onClick={() => navigateToSection("projects")}
                className={`rounded-md px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  activeSection === "projects"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => navigateToSection("developers")}
                className={`rounded-md px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  activeSection === "developers"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Developers
              </button>
              <button
                onClick={() => navigateToSection("organizations")}
                className={`rounded-md px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  activeSection === "organizations"
                    ? "bg-[#8B5CF6] text-white shadow-lg"
                    : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
                }`}
              >
                Organizations
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
