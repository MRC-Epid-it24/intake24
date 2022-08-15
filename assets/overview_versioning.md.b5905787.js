import{_ as e,c as r,o as a,a as s}from"./app.f3069d0f.js";const u=JSON.parse('{"title":"Versioning system","description":"","frontmatter":{},"headers":[{"level":2,"title":"Format","slug":"format"},{"level":3,"title":"Year increments","slug":"year-increments"},{"level":2,"title":"Examples","slug":"examples"},{"level":2,"title":"Pre-release versions","slug":"pre-release-versions"},{"level":3,"title":"Examples","slug":"examples-1"}],"relativePath":"overview/versioning.md"}'),t={name:"overview/versioning.md"},n=s(`<h1 id="versioning-system" tabindex="-1">Versioning system <a class="header-anchor" href="#versioning-system" aria-hidden="true">#</a></h1><p>Intake24 uses a hybrid versioning system based on <a href="https://calver.org" target="_blank" rel="noopener noreferrer">Calendar Versioning (CalVer)</a> and <a href="https://semver.org" target="_blank" rel="noopener noreferrer">Semantic Versioning (semver)</a>.</p><p>Version numbers generally follow the Semantic Versioning principles with the following exceptions:</p><ul><li>Major version is the year of the release in YYYY format</li><li>Minor version starts at 1 instead of 0</li></ul><h2 id="format" tabindex="-1">Format <a class="header-anchor" href="#format" aria-hidden="true">#</a></h2><p>Version numbers follow the format</p><p><span style="font-size:larger;"><strong>YYYY.MINOR.PATCH</strong></span></p><p>where</p><p><strong>YYYY</strong> is the year of the release using the four-digit format,</p><p><strong>MINOR</strong> is the sequential number of a feature release in the corresponding year. &quot;Feature release&quot; means a major release adding new features or functionality or significant changes to existing features.</p><p><strong>PATCH</strong> is the sequential number of a bug fix release. &quot;Bug fix release&quot; means a release focused on fixing issues with existing features without adding new functionality.</p><h3 id="year-increments" tabindex="-1">Year increments <a class="header-anchor" href="#year-increments" aria-hidden="true">#</a></h3><p>Bug fix releases are always associated with a specific feature release (i.e., <strong>YYYY.MINOR</strong>) and the year should never be incremented when releasing bug fix versions, even if a bug fix release occurs in a later year.</p><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-hidden="true">#</a></h2><p><strong>2022.1.0</strong> \u2014 first feature release of 2022,</p><p><strong>2022.2.3</strong> \u2014 third bug fix for the second feature release of 2022,</p><p><strong>2022.4.1</strong> \u2014 a bug fix release for the final, fourth feature release of 2022 that could be released in 2023.</p><h2 id="pre-release-versions" tabindex="-1">Pre-release versions <a class="header-anchor" href="#pre-release-versions" aria-hidden="true">#</a></h2><p>Pre-release versions follow the <a href="https://semver.org/#spec-item-9" target="_blank" rel="noopener noreferrer">Semantic Versioning system</a>:</p><pre><code>A pre-release version MAY be denoted by appending a hyphen and a series of dot separated identifiers immediately following
the patch version.
</code></pre><h3 id="examples-1" tabindex="-1">Examples <a class="header-anchor" href="#examples-1" aria-hidden="true">#</a></h3><p><strong>2022.1.0-beta</strong> \u2014 initial beta release of the first feature release in 2022,</p><p><strong>2022.1.0-beta.4</strong> \u2014 fourth update of the <strong>2022.1.0</strong> beta.</p>`,23),i=[n];function o(l,h,p,f,d,g){return a(),r("div",null,i)}var m=e(t,[["render",o]]);export{u as __pageData,m as default};
