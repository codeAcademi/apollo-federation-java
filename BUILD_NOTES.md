# Build Notes & Troubleshooting

## Java Version Compatibility

This project is designed for **Java 17**. If you encounter build errors with Lombok, it's likely due to Java version incompatibility.

### Check Your Java Version

```bash
java -version
```

### Solution 1: Use Java 17 (Recommended)

If you have multiple Java versions installed, switch to Java 17:

#### macOS/Linux with SDKMAN
```bash
sdk install java 17.0.10-tem
sdk use java 17.0.10-tem
```

#### macOS with Homebrew
```bash
brew install openjdk@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

#### Windows
Download and install Java 17 from https://adoptium.net/
Then set `JAVA_HOME` environment variable.

### Solution 2: For Java 21+  Users

If you must use Java 21 or higher, you'll need to upgrade Lombok:

Edit the parent `pom.xml` and change:
```xml
<lombok.version>1.18.34</lombok.version>
```

To the edge version:
```xml
<lombok.version>edge-SNAPSHOT</lombok.version>
```

And add the Lombok edge repository:
```xml
<repositories>
    <repository>
        <id>projectlombok.org</id>
        <url>https://projectlombok.org/edge-releases</url>
    </repository>
</repositories>
```

Then rebuild:
```bash
mvn clean install -U -DskipTests
```

### Solution 3: Remove Lombok (Most Compatible)

If Lombok continues to cause issues, you can remove it entirely:

1. Remove Lombok dependency from all `pom.xml` files
2. Manually add getters/setters to model classes
3. This works with any Java version but requires more code

## Common Build Errors

### Error: "Cannot find symbol" for getter/setter methods

**Cause:** Lombok annotation processor not running  
**Solution:** Ensure using Java 17, or try Solution 2/3 above

### Error: "java.lang.ExceptionInInitializerError"

**Cause:** Lombok incompatible with Java version  
**Solution:** Use Java 17 (Solution 1)

### Error: "Failed to execute goal...maven-compiler-plugin"

**Cause:** Java/Lombok version mismatch  
**Solution:** Verify Java version with `java -version`

## Successful Build Output

When the build succeeds, you should see:
```
[INFO] BUILD SUCCESS
[INFO] Apollo Federation Demo - Parent .................... SUCCESS
[INFO] Products Service (Subgraph) ........................ SUCCESS
[INFO] Orders Service (Subgraph) .......................... SUCCESS
[INFO] Customers Service (Subgraph) ....................... SUCCESS
```

## Running Without Building

If you can't get the Maven build to work, you can still run the Node.js components:

```bash
# Start just the gateway (requires services to be running elsewhere)
cd gateway
npm install
npm start

# Start the web UI
cd web-ui
npm install
npm start

# Start the MCP server
cd mcp-server
npm install
npm start
```

## Getting Help

If you continue to have build issues:

1. Verify Java version: `java -version` (should be 17)
2. Verify Maven version: `mvn -version` (should be 3.6+)
3. Clear Maven cache: `rm -rf ~/.m2/repository`
4. Try clean build: `mvn clean install -U -DskipTests`

For Lombok-specific issues, visit: https://projectlombok.org/setup/maven

---

**Recommended:** Use Java 17 for the best experience!
