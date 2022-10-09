---
title: Use golangci-lint with your lsp in neovim
description: Configure your Neovim lsp to use golangci-lint for your golang linter
---

# Use golangci-lint with nvim-lspconfig in neovim

## Install golangci-lint and the golangci-lint languageserver
In your terminal. Install golangci-lint and golangci-lint-langserver
```
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install github.com/nametake/golangci-lint-langserver@latest
```

## Setup your Neovim config
I use `go-vim` and `nvim-lspconfig`

init.vim
```
let g:go_metalinter_command = "golangci-lint"

  -- https://github.com/nametake/golangci-lint-langserver
  local configs = require 'lspconfig/configs'
  if not configs.golangcilsp then
    configs.golangcilsp = {
      default_config = {
        cmd = {'golangci-lint-langserver'},
        root_dir = lspconfig.util.root_pattern('.git', 'go.mod'),
        init_options = {
          command = { "golangci-lint", "run", "--fast", "--disable", "lll", "--out-format", "json", "--issues-exit-code=1" };
          }
        };
      }
  end

  lspconfig.golangci_lint_ls.setup {
    filetypes = {'go','gomod'}
  }

```

Now when you open a golang file, nvim-lspconfig will dispatch to
golangci-lint-langserver for linting rules. By default, it will look for your
projects `.golangci.toml` for linting configuration.
