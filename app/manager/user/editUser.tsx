"use client";

import { IMenu, IUser } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { put } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookie";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ButtonDanger, ButtonSuccess } from "@/components/button";
import { InputGroupComponent } from "@/components/inputComponent";
import Modal from "@/components/modal";
import Select from "@/components/select";
import FileInput from "@/components/fileInput";

interface UserResponse {
  status: boolean;
  data: {
    status: boolean;
    data: IMenu[];
    message: string;
  };
}

const EditUser = ({ selectedUser }: { selectedUser: IUser }) => {
  // kode selanjutnya disini
  const [isShow, setIsShow] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({ ...selectedUser });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const TOKEN = getCookie("token") || "";
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const openModal = () => {
    setUser({ ...selectedUser });
    setIsShow(true);
    setShowPassword(false);
    if (formRef.current) formRef.current.reset();
  };
  const changePassword = () => {
    setUser({ ...user, password: "" });
    setShowPassword(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const url = `${BASE_API_URL}/user/${selectedUser.id}`;
      const { name, email, password, role } = user;
      const payload = new FormData();
      payload.append("name", name || "");
      payload.append("email", email || "");
      payload.append("role", role || "");
      if (showPassword && password) payload.append("password", password || "");
      if (file !== null) payload.append("picture", file || "");
      const { data } = (await put(url, payload, TOKEN)) as UserResponse;
      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: true,
          containerId: `toastUser`,
          type: `success`,
        });
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast(data?.message, {
          hideProgressBar: true,
          containerId: `toastUser`,
          type: `success`,
        });
      }
    } catch (error) {
      console.log(error);
      toast(`Something Wrong`, {
        hideProgressBar: true,
        containerId: `toastUser`,
        type: `error`,
      });
    }
  };
  return (
    <div>
      <ButtonSuccess type="button" onClick={() => openModal()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </ButtonSuccess>

      <Modal isShow={isShow} onclose={(state) => setIsShow(state)}>
        <form onSubmit={handleSubmit}>
          {/* modal header */}
          <div className="sticky top-0 bg-sky-600 px-5 pt-5 pb-3 shadow">
            <div className="w-full flex items-center">
              <div className="flex flex-col">
                <strong className="font-bold text-white text-2xl">
                  Update User
                </strong>
                <small className="text-white text-sm">
                  Managers can update both Cashier and Manager roles on this
                  page.
                </small>
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  className="text-white"
                  onClick={() => setIsShow(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* end modal header */}
          {/* modal body */}
          <div className="p-5">
            <InputGroupComponent
              id={`name`}
              type="text"
              value={user.name}
              onChange={(val) => setUser({ ...user, name: val })}
              required={true}
              label="Name"
            />

            <InputGroupComponent
              id={`email`}
              type="text"
              value={user.email}
              onChange={(val) => setUser({ ...user, email: val })}
              required={true}
              label="Email"
            />
            <Select
              id={`role`}
              value={user.role}
              label="Role"
              required={true}
              onChange={(val) => setUser({ ...user, role: val })}
            >
              <option value="">--- Select Category ---</option>
              <option value="MANAGER">Manager</option>
              <option value="CASHIER">Cashier</option>
            </Select>
            <FileInput
              acceptTypes={[
                "application/pdf",
                "image/png",
                "image/jpeg",
                "image/jpg",
              ]}
              id="profile_picture"
              label="Unggah Foto (Max 2MB, PDF/JPG/JPEG/PNG)"
              onChange={(f) => setFile(f)}
              required={false}
            />
            {showPassword && (
              <InputGroupComponent
                id="password"
                type="password"
                value={user.password || ""}
                onChange={(val) => setUser({ ...user, password: val })}
                label="Password default"
                className="text-black"
              />
            )}

            {!showPassword && (
              <ButtonDanger type="button" onClick={() => changePassword()}>
                Ubah Password Default
              </ButtonDanger>
            )}
          </div>
          {/* end modal body */}
          {/* modal footer */}
          <div className="w-full p-5 flex rounded-b-2xl shadow">
            <div className="flex ml-auto gap-2">
              <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                Cancel
              </ButtonDanger>
              <ButtonSuccess type="submit">Save</ButtonSuccess>
            </div>
          </div>
          {/* end modal footer */}
        </form>
      </Modal>
    </div>
  );
};
export default EditUser;
