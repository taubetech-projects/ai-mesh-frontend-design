export function SelectionList({
  title,
  items,
  selected,
  onChange,
}: {
  title: string;
  items: string[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}) {
  const allSelected = items.length > 0 && items.every((item) => selected.has(item));
  const isIndeterminate = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      onChange(new Set());
    } else {
      onChange(new Set(items));
    }
  };

  const toggleItem = (item: string) => {
    const next = new Set(selected);
    if (next.has(item)) {
      next.delete(item);
    } else {
      next.add(item);
    }
    onChange(next);
  };

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-[200px]">
      <div className="p-2 border-b bg-muted/40 flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
          checked={allSelected}
          ref={(input) => {
            if (input) input.indeterminate = isIndeterminate;
          }}
          onChange={toggleAll}
        />
        <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {selected.size} selected
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              checked={selected.has(item)}
              onChange={() => toggleItem(item)}
            />
            <span className="text-sm truncate" title={item}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}