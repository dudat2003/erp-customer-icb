import { Avatar, AvatarGroup, Card, CardBody } from "@heroui/react";
import React from "react";
import { useStaff } from "@/hooks/use-staff";
import { Staff } from "@prisma/client";

export const CardAgents = () => {
  const { data: staffData, isLoading } = useStaff();
  const staff = staffData?.data || [];
  const displayStaff = staff.slice(0, 5); // Show first 5 staff members

  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-4 py-6 w-full">
      <CardBody className="py-5 gap-6">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              {"👥"} Đội ngũ nhân viên
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-col">
          <span className="text-xs text-center">
            {isLoading
              ? "Đang tải danh sách nhân viên..."
              : `${staff.length} nhân viên đang làm việc`}
          </span>

          {!isLoading && displayStaff.length > 0 && (
            <AvatarGroup isBordered max={5}>
              {displayStaff.map((member: Staff) => (
                <Avatar
                  key={member.id}
                  src={`https://i.pravatar.cc/150?u=${member.id}`}
                  name={member.name}
                />
              ))}
            </AvatarGroup>
          )}

          <div className="flex flex-col gap-2 w-full">
            {displayStaff.slice(0, 5).map((member: Staff) => (
              <div key={member.id} className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  src={`https://i.pravatar.cc/150?u=${member.id}`}
                  name={member.name}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">{member.name}</span>
                  <span className="text-xs text-default-500">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
