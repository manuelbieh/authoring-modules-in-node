// This plugin adds .mjs to all file imports/exports
// based on	@lukejacksonn's PR:
// https://github.com/graphql/graphql-js/pull/2277

module.exports = ({ types }) => {
    return {
        visitor: {
            ImportDeclaration: function(path) {
                if (!path.node.source) {
                    return;
                }
                const source = path.node.source.value;
                if (source.match(/^\.{0,2}\//) && !source.endsWith('.mjs')) {
                    path.replaceWith(
                        types.importDeclaration(
                            path.node.specifiers,
                            types.stringLiteral(source + '.mjs')
                        )
                    );
                }
            },
            ExportNamedDeclaration: function(path) {
                if (!path.node.source) {
                    return;
                }
                const source = path.node.source.value;
                if (source.match(/^\.{0,2}\//) && !source.endsWith('.mjs')) {
                    path.replaceWith(
                        types.exportNamedDeclaration(
                            path.node.declaration,
                            path.node.specifiers,
                            types.stringLiteral(source + '.mjs')
                        )
                    );
                }
            },
        },
    };
};
