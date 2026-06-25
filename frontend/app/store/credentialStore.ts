import { create } from "zustand";

export interface CredentialItem {
  id: number;
  user_id: number;
  name: string;
  provider: string;
  credential_type: string;
  created_at: string;
}

interface CredentialStore {
  credentials: CredentialItem[];

  setCredentials: (
    credentials: CredentialItem[]
  ) => void;

  addCredential: (
    credential: CredentialItem
  ) => void;

  removeCredential: (
    credentialId: number
  ) => void;

  clearCredentials: () => void;
}

export const useCredentialStore =
  create<CredentialStore>((set) => ({
    credentials: [],

    setCredentials: (credentials) =>
      set({
        credentials,
      }),

    addCredential: (credential) =>
      set((state) => ({
        credentials: [
          credential,
          ...state.credentials,
        ],
      })),

    removeCredential: (
      credentialId
    ) =>
      set((state) => ({
        credentials:
          state.credentials.filter(
            (credential) =>
              credential.id !==
              credentialId
          ),
      })),

    clearCredentials: () =>
      set({
        credentials: [],
      }),
  }));