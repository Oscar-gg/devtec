"use client";

import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { Button } from "../../_components/button";

type ProfileData = RouterOutputs["user"]["getProfile"];

interface ProfileEditModalProps {
  profile: ProfileData;
  onClose: () => void;
}

export function ProfileEditModal({ profile, onClose }: ProfileEditModalProps) {
  const [preferences, setPreferences] = useState({
    showGenericImage: profile.userPreferences?.showGenericImage ?? false,
    showEmail: profile.userPreferences?.showEmail ?? false,
    showSchoolEmail: profile.userPreferences?.showSchoolEmail ?? false,
    showProfile: profile.userPreferences?.showProfile ?? true,
    showWorkExperience: profile.userPreferences?.showWorkExperience ?? true,
    showOrganizations: profile.userPreferences?.showOrganizations ?? true,
    showRelatedProjects: profile.userPreferences?.showRelatedProjects ?? true,
  });

  const utils = api.useUtils();

  const updatePreferencesMutation = api.user.updatePreferences.useMutation({
    onSuccess: async () => {
      await utils.user.getProfile.invalidate();
      await utils.user.getPublicProfile.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update preferences
      await updatePreferencesMutation.mutateAsync(preferences);

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePreferenceChange =
    (field: keyof typeof preferences) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPreferences((prev) => ({
        ...prev,
        [field]: e.target.checked,
      }));
    };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Privacy Settings */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Privacy Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showProfile"
                  checked={preferences.showProfile}
                  onChange={handlePreferenceChange("showProfile")}
                  className="h-4 w-4 rounded border-gray-600 bg-[#2A2A2A] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label htmlFor="showProfile" className="text-sm text-gray-300">
                  Show profile in developers list
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showEmail"
                  checked={preferences.showEmail}
                  onChange={handlePreferenceChange("showEmail")}
                  className="h-4 w-4 rounded border-gray-600 bg-[#2A2A2A] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label htmlFor="showEmail" className="text-sm text-gray-300">
                  Show email to other users (primary email)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showSchoolEmail"
                  checked={preferences.showSchoolEmail}
                  onChange={handlePreferenceChange("showSchoolEmail")}
                  className="h-4 w-4 rounded border-gray-600 bg-[#2A2A2A] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label
                  htmlFor="showSchoolEmail"
                  className="text-sm text-gray-300"
                >
                  Show school email to other users (@tec.mx)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showGenericImage"
                  checked={preferences.showGenericImage}
                  onChange={handlePreferenceChange("showGenericImage")}
                  className="h-4 w-4 rounded border-gray-600 bg-[#2A2A2A] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label
                  htmlFor="showGenericImage"
                  className="text-sm text-gray-300"
                >
                  Use generic avatar instead of profile image
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showWorkExperience"
                  checked={preferences.showWorkExperience}
                  onChange={handlePreferenceChange("showWorkExperience")}
                  className="h-4 w-4 rounded border-gray-600 bg-[#2A2A2A] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label
                  htmlFor="showWorkExperience"
                  className="text-sm text-gray-300"
                >
                  Show work experience
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showOrganizations"
                  checked={preferences.showOrganizations}
                  onChange={handlePreferenceChange("showOrganizations")}
                  className="h-4 w-4 rounded border-gray-600 bg-[#2A2A2A] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label
                  htmlFor="showOrganizations"
                  className="text-sm text-gray-300"
                >
                  Show organizations
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showRelatedProjects"
                  checked={preferences.showRelatedProjects}
                  onChange={handlePreferenceChange("showRelatedProjects")}
                  className="h-4 w-4 rounded border-gray-600 bg-[#2A2A2A] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label
                  htmlFor="showRelatedProjects"
                  className="text-sm text-gray-300"
                >
                  Show related projects
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 transition-colors hover:bg-[#2A2A2A]"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={updatePreferencesMutation.isPending}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
            >
              {updatePreferencesMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
