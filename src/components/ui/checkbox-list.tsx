import { Checkbox } from "@/components/ui/checkbox";
import { TextCode } from "../../../components/ui/typography";

type CheckboxListProps = {
  items: string[];
  selectedItems: string[];
  onChange: (selected: string[]) => void;
};

const CheckboxList: React.FC<CheckboxListProps> = ({
  items,
  selectedItems,
  onChange,
}) => {
  const handleToggle = (item: string) => {
    if (selectedItems.includes(item)) {
      onChange(selectedItems.filter((i) => i !== item));
    } else {
      onChange([...selectedItems, item]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent/50 transition-colors"
        >
          <Checkbox
            id={item}
            checked={selectedItems.includes(item)}
            onCheckedChange={() => handleToggle(item)}
            className="h-5 w-5"
          />
          <label
            htmlFor={item}
            className="flex-1 leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm md:text-base"
          >
            <TextCode>{item}</TextCode>
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxList;
