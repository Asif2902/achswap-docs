import MDXComponents from "@theme-original/MDXComponents";

/**
 * Markdown tables, in a box that scrolls sideways when a table is wider than the content column
 * (a row of addresses and hashes), instead of running under the table of contents. The table
 * itself stays full width.
 */
function ScrollTable(props) {
  return (
    <div className="table-scroll">
      <table {...props} />
    </div>
  );
}

export default {
  ...MDXComponents,
  table: ScrollTable,
};
