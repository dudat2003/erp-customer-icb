import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@heroui/react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { deleteAuthCookie } from "@/actions/auth.action";

export const UserDropdown = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await deleteAuthCookie();
    router.replace("/login");
  }, [router]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar as="button" color="secondary" size="md" />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions">
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        ></DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          onPress={handleLogout}
        >
          Đăng xuất
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
