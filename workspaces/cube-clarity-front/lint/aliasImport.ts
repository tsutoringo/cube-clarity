const availableAlias: string[] = ["components", "layouts", "lib", "assets"];

export default {
  name: "alias-import",
  rules: {
    "use-alias-import": {
      create(context) {
        return {
          ImportDeclaration(node) {
            if (!node.source.value.startsWith(".")) return;

            const trimedSource = node.source.value.replace(/^(\.?\.\/)*/, "");
            const nonAliasType = trimedSource.match(
              new RegExp(`^(${availableAlias.join("|")})\\/`),
            )?.[0];

            if (!nonAliasType) return;

            context.report({
              node,
              message: "This import has alias.",
              fix(fixer) {
                const fixed = node.source.value.replace(/^(\.?\.\/)*/, "@");
                return fixer.replaceText(node.source, `"${fixed}"`);
              },
            });
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
