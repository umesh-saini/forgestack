import readline from 'node:readline';
import color from 'picocolors';

export interface SearchableItem {
  id: string;
  label: string;
  hint?: string;
  selected?: boolean;
}

export interface SearchableMultiselectOptions {
  message: string;
  items: SearchableItem[];
  pageSize?: number;
  initialSelected?: string[];
}

export async function searchableMultiselect(
  options: SearchableMultiselectOptions
): Promise<string[]> {
  const { message, items, pageSize = 10, initialSelected = [] } = options;

  // In non-interactive / non-TTY environments, return defaults
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return initialSelected.length > 0
      ? initialSelected
      : items.filter((i) => i.selected).map((i) => i.id);
  }

  return new Promise<string[]>((resolve) => {
    const selected = new Set<string>(
      initialSelected.length > 0
        ? initialSelected
        : items.filter((i) => i.selected).map((i) => i.id)
    );

    let searchQuery = '';
    let cursorIndex = 0;
    let renderedLineCount = 0;

    // Filter items based on current search query
    const getFilteredItems = (): SearchableItem[] => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return items;
      return items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          (item.hint && item.hint.toLowerCase().includes(q)) ||
          item.id.toLowerCase().includes(q)
      );
    };

    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\u001B[?25h'); // show cursor
    };

    const render = () => {
      // Clear previous lines
      if (renderedLineCount > 0) {
        readline.moveCursor(process.stdout, 0, -renderedLineCount);
        readline.clearScreenDown(process.stdout);
      }

      const filtered = getFilteredItems();
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      const currentPage = Math.min(
        totalPages - 1,
        Math.floor(cursorIndex / pageSize)
      );
      const startIndex = currentPage * pageSize;
      const visibleItems = filtered.slice(startIndex, startIndex + pageSize);

      const lines: string[] = [];

      // Header
      const selectedNames = items
        .filter((i) => selected.has(i.id))
        .map((i) => i.label);
      const selectedPreview =
        selectedNames.length > 0
          ? color.cyan(selectedNames.slice(0, 3).join(', ')) +
            (selectedNames.length > 3 ? color.dim(` (+${selectedNames.length - 3} more)`) : '')
          : color.dim('none');

      lines.push(
        `${color.bold(color.blue('?'))} ${color.bold(message)} ${color.dim(`(${items.length} available)`)}`
      );
      lines.push(`  ${color.dim('Selected:')} ${selectedPreview}`);
      lines.push(
        `  ${color.dim('Search:')} ${color.yellow(searchQuery ? `[${searchQuery}]` : '[type to filter]')}`
      );
      lines.push(
        `  ${color.dim('↑↓ navigate • Space toggle • Backspace clear filter • Enter confirm')}`
      );

      // List
      if (visibleItems.length === 0) {
        lines.push(`  ${color.dim('No matches found for')} "${color.yellow(searchQuery)}"`);
      } else {
        visibleItems.forEach((item, idx) => {
          const absoluteIndex = startIndex + idx;
          const isCursor = absoluteIndex === cursorIndex;
          const isChecked = selected.has(item.id);

          const pointer = isCursor ? color.cyan('>') : ' ';
          const checkbox = isChecked
            ? color.green('[x]')
            : color.dim('[ ]');
          const label = isCursor ? color.bold(color.white(item.label)) : item.label;
          const hint = item.hint ? color.dim(` (${item.hint})`) : '';

          lines.push(`  ${pointer} ${checkbox} ${label}${hint}`);
        });
      }

      // Pagination Indicator
      if (totalPages > 1) {
        lines.push(`  ${color.dim(`(${currentPage + 1}/${totalPages})`)}`);
      }

      // Output lines
      process.stdout.write(lines.join('\n') + '\n');
      renderedLineCount = lines.length;
    };

    // Setup terminal
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdout.write('\u001B[?25l'); // hide cursor

    render();

    const onKeypress = (data: string) => {
      // Enter
      if (data === '\r' || data === '\n') {
        cleanup();
        process.stdin.removeListener('data', onKeypress);
        process.stdout.write('\n');
        resolve(Array.from(selected));
        return;
      }

      // Ctrl+C
      if (data === '\u0003') {
        cleanup();
        process.stdin.removeListener('data', onKeypress);
        console.log(color.red('\nCancelled.'));
        process.exit(0);
      }

      // Up arrow
      if (data === '\u001b[A' || data === '\u001bOA') {
        const filtered = getFilteredItems();
        if (filtered.length > 0) {
          cursorIndex = (cursorIndex - 1 + filtered.length) % filtered.length;
        }
        render();
        return;
      }

      // Down arrow
      if (data === '\u001b[B' || data === '\u001bOB') {
        const filtered = getFilteredItems();
        if (filtered.length > 0) {
          cursorIndex = (cursorIndex + 1) % filtered.length;
        }
        render();
        return;
      }

      // Space -> Toggle
      if (data === ' ') {
        const filtered = getFilteredItems();
        if (filtered.length > 0 && cursorIndex < filtered.length) {
          const currentItem = filtered[cursorIndex];
          if (selected.has(currentItem.id)) {
            selected.delete(currentItem.id);
          } else {
            selected.add(currentItem.id);
          }
        }
        render();
        return;
      }

      // Backspace
      if (data === '\u0008' || data === '\u007f') {
        if (searchQuery.length > 0) {
          searchQuery = searchQuery.slice(0, -1);
          cursorIndex = 0;
          render();
        }
        return;
      }

      // Regular typing (alphanumeric, symbols)
      if (data.length === 1 && data >= ' ' && data <= '~') {
        searchQuery += data;
        cursorIndex = 0;
        render();
        return;
      }
    };

    process.stdin.on('data', onKeypress);
  });
}
