import data from "@/src/lib/data.json";
import Center from "@/src/ui/components/Center";
import Group from "@/src/ui/components/Group";



// Root page
export default function Page() {
  const { title, description } = data;
  const groups = data.groups || [];

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
      <Center 
        title={title}
        desciption={description}
      />
      {groups[0] && (
        <div className="absolute -top-6 -right-48 translate-y-[-100%] translate-x-[-100%]">
        <Group group={groups[0]} index={0} />
        </div>
      )}
      {groups[1] && (
        <div className="absolute top-24 left-4 translate-y-[-100%] translate-x-[100%]">
        <Group group={groups[1]} index={1} />
        </div>
      )}
      {groups[2] && (
        <div className="absolute bottom-10 right-0 translate-y-[100%] translate-x-[-100%]">
        <Group group={groups[2]} index={2} />
        </div>
      )}
      {groups[3] && (
        <div className="absolute -bottom-6 -left-32 translate-y-[100%] translate-x-[100%]">
        <Group group={groups[3]} index={3} />
        </div>
      )}
      </div>
    </div>
  );
}