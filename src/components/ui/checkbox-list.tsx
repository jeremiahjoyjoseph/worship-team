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
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            id={item}
            checked={selectedItems.includes(item)}
            onCheckedChange={() => handleToggle(item)}
          />
          <label
            htmlFor={item}
            className="leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <TextCode>{item}</TextCode>
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxList;
