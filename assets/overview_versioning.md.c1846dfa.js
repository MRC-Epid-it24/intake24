import{_ as e,o as r,c as a,Q as s}from"./chunks/framework.b40c9ff3.js";const c=JSON.parse('{"title":"Versioning system","description":"","frontmatter":{},"headers":[],"relativePath":"overview/versioning.md","filePath":"overview/versioning.md"}'),t={name:"overview/versioning.md"},n=s(`<h1 id="versioning-system" tabindex="-1">Versioning system <a class="header-anchor" href="#versioning-system" aria-label="Permalink to &quot;Versioning system&quot;">​</a></h1><p>Intake24 uses a hybrid versioning system based on <a href="https://calver.org" target="_blank" rel="noreferrer">Calendar Versioning (CalVer)</a> and <a href="https://semver.org" target="_blank" rel="noreferrer">Semantic Versioning (semver)</a>.</p><p>Version numbers generally follow the Semantic Versioning principles with the following exceptions:</p><ul><li>Major version is the year of the release in YYYY format</li><li>Minor version starts at 1 instead of 0</li></ul><h2 id="format" tabindex="-1">Format <a class="header-anchor" href="#format" aria-label="Permalink to &quot;Format&quot;">​</a></h2><p>Version numbers follow the format</p><p><span style="font-size:larger;"><strong>YYYY.MINOR.PATCH</strong></span></p><p>where</p><p><strong>YYYY</strong> is the year of the release using the four-digit format,</p><p><strong>MINOR</strong> is the sequential number of a feature release in the corresponding year. &quot;Feature release&quot; means a major release adding new features or functionality or significant changes to existing features.</p><p><strong>PATCH</strong> is the sequential number of a bug fix release. &quot;Bug fix release&quot; means a release focused on fixing issues with existing features without adding new functionality.</p><h3 id="year-increments" tabindex="-1">Year increments <a class="header-anchor" href="#year-increments" aria-label="Permalink to &quot;Year increments&quot;">​</a></h3><p>Bug fix releases are always associated with a specific feature release (i.e., <strong>YYYY.MINOR</strong>) and the year should never be incremented when releasing bug fix versions, even if a bug fix release occurs in a later year.</p><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to &quot;Examples&quot;">​</a></h2><p><strong>2022.1.0</strong> — first feature release of 2022,</p><p><strong>2022.2.3</strong> — third bug fix for the second feature release of 2022,</p><p><strong>2022.4.1</strong> — a bug fix release for the final, fourth feature release of 2022 that could be released in 2023.</p><h2 id="pre-release-versions" tabindex="-1">Pre-release versions <a class="header-anchor" href="#pre-release-versions" aria-label="Permalink to &quot;Pre-release versions&quot;">​</a></h2><p>Pre-release versions follow the <a href="https://semver.org/#spec-item-9" target="_blank" rel="noreferrer">Semantic Versioning system</a>:</p><pre><code>A pre-release version MAY be denoted by appending a hyphen and a series of dot separated identifiers immediately following
the patch version.
</code></pre><h3 id="examples-1" tabindex="-1">Examples <a class="header-anchor" href="#examples-1" aria-label="Permalink to &quot;Examples&quot;">​</a></h3><p><strong>2022.1.0-beta</strong> — initial beta release of the first feature release in 2022,</p><p><strong>2022.1.0-beta.4</strong> — fourth update of the <strong>2022.1.0</strong> beta.</p>`,23),o=[n];function i(l,h,f,p,g,d){return r(),a("div",null,o)}const m=e(t,[["render",i]]);export{c as __pageData,m as default};