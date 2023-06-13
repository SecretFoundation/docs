# Cargo.toml Best Practices (Crates vs Dependencies)

### SCRT Labs and Crates.io

Crates.io serves as a centralized repository for Rust packages, also known as "crates." When building applications or libraries with Rust, developers often need to use external libraries for functionality not provided by the standard library, many of which are included on Crates.io. **However, Secret Labs stopped publishing to crates.io in order to improve compatibility with vanilla Cosmwasm libraries.**&#x20;

This workaround involves "patching" existing libraries, which simply requires you to put a patch statement in your Cargo.toml file. Using `patch` will allow you to always use the latest and most updated package version. The cargo.toml syntax for patching a crate so that it is compatible with Secret Network requires adding `[patch.crates-io]` to your cargo.toml file like so:&#x20;

```
[dependencies]
cosmwasm-std = { git = "https://github.com/scrtlabs/cosmwasm", tag = "v1.1.9-secret" }
cosmwasm-storage = { git = "https://github.com/scrtlabs/cosmwasm", tag = "v1.1.9-secret" }
schemars = { version = "0.8.11" }
serde = { version = "1.0" }
thiserror = { version = "1.0" }
cosmwasm-schema = "1.0.0"

# Uncomment these for some common extra tools
# secret-toolkit = { git = "https://github.com/scrtlabs/secret-toolkit", tag = "v0.8.0" }
# cw-storage-plus = { version = "1.0.1", default-features = false }

# [patch.crates-io]
# uncomment this if you use cw-storage-plus
# cosmwasm-std = { git = "https://github.com/scrtlabs/cosmwasm", tag = "v1.1.9-secret" }

```

### Further Reading: Crates vs Dependencies

You can think of "crates" as individual packages or modules in Rust, while "dependencies" refer to external crates that your project relies on for additional functionality.

When developing a Rust project, you will often have dependencies on other crates. These dependencies can come from crates.io (the default Rust package registry), a Git repository (such as one hosted by Secret Labs!), or a local path on your system. The Rust package manager, Cargo, is responsible for managing these dependencies, ensuring that the correct versions are fetched and built, and handling transitive dependencies (i.e., the dependencies of your dependencies).

* Crates: A crate is a package or a module in Rust containing code and resources, like libraries or applications. Crates are the building blocks of Rust projects and are intended to be easily shared and reused. A crate can be a binary (application) or a library. Each crate has a unique name and a `Cargo.toml` file containing metadata, such as the crate's name, version, authors, and dependencies.
* Dependencies: Dependencies refer to external crates that your Rust project or library relies on for additional functionality. These external crates are not part of your project's codebase but are required for your project to build and function correctly. Dependencies are declared in the `Cargo.toml` file of your project under the `[dependencies]` section.
