module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    "md",
    "jpg",
    "png",
    "gif",
    "svg",
    "webp",
    "woff",
    "woff2",
    "toml",
    "webmanifest"
  ]);
  
  const markdown = require("markdown-it")({
    html: true
  });
  const cleancss = require("clean-css");
  const imgix = require("@imgix/js-core");
  
  eleventyConfig.addShortcode("markdown", (content) => {
    return markdown.render(content);
  });
  
  eleventyConfig.addFilter("cssmin", function(code) {
    return new cleancss({}).minify(code).styles;
  });
  
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    
    dir: {
      layouts: "_layouts",
      includes: "_includes",
      input: "input",
      output: "output"
    }
  }
};