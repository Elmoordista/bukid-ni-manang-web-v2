import { useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockAccommodations } from "@/data/mockData";
import type { Accommodation } from "@/data/mockData";

interface BlockedDate {
  roomId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export default function AvailabilityCalendar() {
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isBlockingDialogOpen, setIsBlockingDialogOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [blockReason, setBlockReason] = useState<string>("");
  const { toast } = useToast();

  const handleBlockDates = () => {
    if (!selectedRoom || !selectedDates.from || !selectedDates.to) {
      toast({
        title: "Error",
        description: "Please select a room and date range",
        variant: "destructive",
      });
      return;
    }

    setBlockedDates([
      ...blockedDates,
      {
        roomId: selectedRoom,
        startDate: selectedDates.from,
        endDate: selectedDates.to,
        reason: blockReason,
      },
    ]);

    setSelectedDates({ from: undefined, to: undefined });
    setBlockReason("");
    setIsBlockingDialogOpen(false);

    toast({
      title: "Dates Blocked",
      description: "The selected dates have been blocked successfully.",
    });
  };

  const handleUnblockDates = (roomId: string, startDate: Date) => {
    setBlockedDates(
      blockedDates.filter(
        (block) =>
          !(block.roomId === roomId &&
          block.startDate.getTime() === startDate.getTime())
      )
    );

    toast({
      title: "Dates Unblocked",
      description: "The selected dates have been unblocked successfully.",
    });
  };

  const isDateBlocked = (date: Date, roomId: string) => {
    return blockedDates.some(
      (block) =>
        block.roomId === roomId &&
        date >= block.startDate &&
        date <= block.endDate
    );
  };

  const getBlockReason = (date: Date, roomId: string) => {
    const block = blockedDates.find(
      (block) =>
        block.roomId === roomId &&
        date >= block.startDate &&
        date <= block.endDate
    );
    return block?.reason || "";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Room Availability Calendar</CardTitle>
        <div className="flex items-center space-x-4">
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rooms</SelectLabel>
                {mockAccommodations.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsBlockingDialogOpen(true)}
            disabled={!selectedRoom}
          >
            Block Dates
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {selectedRoom && (
            <div>
              <Calendar
                mode="range"
                selected={selectedDates}
                onSelect={(range: any) => setSelectedDates(range)}
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
                modifiers={{
                  blocked: (date) => isDateBlocked(date, selectedRoom),
                }}
                modifiersStyles={{
                  blocked: {
                    backgroundColor: "rgb(239 68 68 / 0.2)",
                    textDecoration: "line-through",
                  },
                }}
              />
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Blocked Periods</h3>
                <div className="space-y-2">
                  {blockedDates
                    .filter((block) => block.roomId === selectedRoom)
                    .map((block, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-secondary rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {format(block.startDate, "PPP")} -{" "}
                            {format(block.endDate, "PPP")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {block.reason}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleUnblockDates(block.roomId, block.startDate)
                          }
                        >
                          Unblock
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Dialog
          open={isBlockingDialogOpen}
          onOpenChange={setIsBlockingDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block Room Dates</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Calendar
                mode="range"
                selected={selectedDates}
                onSelect={(range: any) => setSelectedDates(range)}
                initialFocus
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
              />
              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason for Blocking
                </label>
                <textarea
                  id="reason"
                  className="w-full h-20 p-2 border rounded-md"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter reason for blocking these dates..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsBlockingDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleBlockDates}>Block Dates</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}