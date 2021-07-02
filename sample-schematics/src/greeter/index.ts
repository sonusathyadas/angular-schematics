import { strings } from '@angular-devkit/core';
import { apply, Rule, SchematicContext, Tree, url, template, mergeWith } from '@angular-devkit/schematics';
import { Schema } from './schema';

export function greeter(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceTemplate = url("./files");
    const parameterizedTemplate = apply(sourceTemplate, [
      template({
        ..._options,
        ...strings
      })
    ]);
    tree = mergeWith(parameterizedTemplate)(tree, _context) as Tree;
    return tree;
  };
}
