import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
} from "@heroui/react";
import React from "react";
import { NotificationIcon } from "../icons/navbar/notificationicon";

export const NotificationsDropdown = () => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Avatar Actions">
        <DropdownSection title="Notificacions">
          <DropdownItem key="notification1">No new notifications</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
