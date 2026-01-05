export function SelectionList({
  title,
  items,
  selected,
  onChange,
}: {
  title: string;
  items: Map<string, string>;
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}) {
  const allSelected =
    items.size > 0 &&
    Array.from(items.keys()).every((key) => selected.has(key));
  const isIndeterminate = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      onChange(new Set());
    } else {
      onChange(new Set(items.keys()));
    }
  };

  const toggleItem = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
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
        <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {selected.size} selected
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {Array.from(items.entries()).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
              checked={selected.has(key)}
              onChange={() => toggleItem(key)}
            />
            <span className="text-sm truncate" title={value}>
              {value}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
