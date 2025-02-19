export default {
  name: "classnames-name",
  rules: {
    "classnames-import-name": {
      create(context) {
        return {
          ImportDefaultSpecifier(node) {
            const parent = getParentNode(context, node)
            if (parent?.type != "ImportDeclaration") return;
            if (parent.source.value != "classnames") return;

            if (node.local.name == "classNames") return;

            context.report({
              node,
              message: "classname import default name should be classNames",
            });
          }
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;

function getParentNode(
  ctx: Deno.lint.RuleContext,
  node: Deno.lint.Node,
): Deno.lint.Node | null {
  const ancestors = ctx.sourceCode.getAncestors(node);
  return ancestors[ancestors.length - 1] ?? null;
}
