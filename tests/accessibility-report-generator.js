const fs = require('fs')
const path = require('path')

/**
 * Accessibility Report Generator
 * Generates comprehensive HTML reports from accessibility test results
 */

class AccessibilityReportGenerator {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'accessibility-reports'
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  /**
   * Generate HTML report from test results
   */
  generateReport(results, options = {}) {
    const reportData = {
      timestamp: this.timestamp,
      summary: this.generateSummary(results),
      pages: this.processResults(results),
      recommendations: this.generateRecommendations(results)
    }

    const html = this.generateHTML(reportData)
    const filename = `accessibility-report-${this.timestamp}.html`
    const filepath = path.join(this.outputDir, filename)
    
    fs.writeFileSync(filepath, html)
    
    // Also generate JSON report for programmatic access
    const jsonFilename = `accessibility-report-${this.timestamp}.json`
    const jsonFilepath = path.join(this.outputDir, jsonFilename)
    fs.writeFileSync(jsonFilepath, JSON.stringify(reportData, null, 2))
    
    console.log(`📊 Accessibility report generated: ${filepath}`)
    console.log(`📄 JSON report generated: ${jsonFilepath}`)
    
    return { html: filepath, json: jsonFilepath }
  }

  generateSummary(results) {
    const totalViolations = results.reduce((sum, page) => sum + page.violations.length, 0)
    const totalPages = results.length
    const passedPages = results.filter(page => page.violations.length === 0).length
    
    const violationsByImpact = results.reduce((acc, page) => {
      page.violations.forEach(violation => {
        acc[violation.impact] = (acc[violation.impact] || 0) + 1
      })
      return acc
    }, {})

    return {
      totalPages,
      passedPages,
      failedPages: totalPages - passedPages,
      totalViolations,
      violationsByImpact,
      complianceRate: Math.round((passedPages / totalPages) * 100)
    }
  }

  processResults(results) {
    return results.map(page => ({
      ...page,
      violationsByImpact: page.violations.reduce((acc, violation) => {
        acc[violation.impact] = acc[violation.impact] || []
        acc[violation.impact].push(violation)
        return acc
      }, {}),
      status: page.violations.length === 0 ? 'passed' : 'failed'
    }))
  }

  generateRecommendations(results) {
    const allViolations = results.flatMap(page => page.violations)
    const violationCounts = {}
    
    // Count frequency of each violation type
    allViolations.forEach(violation => {
      violationCounts[violation.id] = (violationCounts[violation.id] || 0) + 1
    })
    
    // Sort by frequency and generate recommendations
    const sortedViolations = Object.entries(violationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // Top 10 most common issues
    
    return sortedViolations.map(([violationId, count]) => {
      const violation = allViolations.find(v => v.id === violationId)
      return {
        id: violationId,
        count,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        priority: this.calculatePriority(violation.impact, count)
      }
    })
  }

  calculatePriority(impact, frequency) {
    const impactWeight = {
      critical: 4,
      serious: 3,
      moderate: 2,
      minor: 1
    }
    
    return (impactWeight[impact] || 1) * frequency
  }

  generateHTML(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report - ${data.timestamp}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #1e40af; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #1e40af; }
        .metric-value { font-size: 2em; font-weight: bold; color: #1e40af; }
        .metric-label { color: #64748b; margin-top: 5px; }
        .page-result { margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .page-header { padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .page-title { margin: 0; color: #1e293b; }
        .status-passed { color: #059669; }
        .status-failed { color: #dc2626; }
        .violations { padding: 20px; }
        .violation { margin-bottom: 20px; padding: 15px; border-left: 4px solid #fbbf24; background: #fffbeb; border-radius: 0 4px 4px 0; }
        .violation.critical { border-left-color: #dc2626; background: #fef2f2; }
        .violation.serious { border-left-color: #ea580c; background: #fff7ed; }
        .violation.moderate { border-left-color: #fbbf24; background: #fffbeb; }
        .violation.minor { border-left-color: #10b981; background: #f0fdf4; }
        .violation-title { font-weight: bold; margin-bottom: 5px; }
        .violation-description { margin-bottom: 10px; }
        .violation-help { background: white; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
        .violation-nodes { font-size: 0.9em; color: #64748b; }
        .recommendations { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .recommendation { margin-bottom: 15px; padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #0ea5e9; }
        .priority-high { border-left-color: #dc2626; }
        .priority-medium { border-left-color: #ea580c; }
        .priority-low { border-left-color: #10b981; }
        .impact-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; }
        .impact-critical { background: #dc2626; color: white; }
        .impact-serious { background: #ea580c; color: white; }
        .impact-moderate { background: #fbbf24; color: #92400e; }
        .impact-minor { background: #10b981; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Accessibility Audit Report</h1>
            <p>Generated on ${new Date(data.timestamp).toLocaleString()}</p>
            <p>Second Turn Games - Board Game Marketplace</p>
        </div>
        
        <div class="content">
            <div class="summary">
                <div class="metric">
                    <div class="metric-value">${data.summary.complianceRate}%</div>
                    <div class="metric-label">Compliance Rate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${data.summary.passedPages}</div>
                    <div class="metric-label">Pages Passed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${data.summary.failedPages}</div>
                    <div class="metric-label">Pages Failed</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${data.summary.totalViolations}</div>
                    <div class="metric-label">Total Violations</div>
                </div>
            </div>

            <h2>📊 Violations by Impact Level</h2>
            <div class="summary">
                <div class="metric">
                    <div class="metric-value">${data.summary.violationsByImpact.critical || 0}</div>
                    <div class="metric-label">Critical</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${data.summary.violationsByImpact.serious || 0}</div>
                    <div class="metric-label">Serious</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${data.summary.violationsByImpact.moderate || 0}</div>
                    <div class="metric-label">Moderate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${data.summary.violationsByImpact.minor || 0}</div>
                    <div class="metric-label">Minor</div>
                </div>
            </div>

            <h2>📄 Page Results</h2>
            ${data.pages.map(page => `
                <div class="page-result">
                    <div class="page-header">
                        <h3 class="page-title">
                            ${page.name} 
                            <span class="status-${page.status}">${page.status.toUpperCase()}</span>
                        </h3>
                        <p>${page.url}</p>
                    </div>
                    ${page.violations.length > 0 ? `
                        <div class="violations">
                            ${Object.entries(page.violationsByImpact).map(([impact, violations]) => 
                                violations.map(violation => `
                                    <div class="violation ${impact}">
                                        <div class="violation-title">
                                            ${violation.id}
                                            <span class="impact-badge impact-${impact}">${impact}</span>
                                        </div>
                                        <div class="violation-description">${violation.description}</div>
                                        <div class="violation-help">
                                            <strong>How to fix:</strong> ${violation.help}
                                            <br><a href="${violation.helpUrl}" target="_blank">Learn more →</a>
                                        </div>
                                        <div class="violation-nodes">
                                            ${violation.nodes.length} element(s) affected: ${violation.nodes.map(node => node.target.join(' > ')).join(', ')}
                                        </div>
                                    </div>
                                `).join('')
                            ).join('')}
                        </div>
                    ` : '<div class="violations"><p style="color: #059669; text-align: center; padding: 20px;">✅ No accessibility violations found</p></div>'}
                </div>
            `).join('')}

            ${data.recommendations.length > 0 ? `
                <div class="recommendations">
                    <h2>🎯 Priority Recommendations</h2>
                    <p>Based on violation frequency and impact, here are the top priority fixes:</p>
                    ${data.recommendations.map((rec, index) => `
                        <div class="recommendation priority-${rec.priority > 10 ? 'high' : rec.priority > 5 ? 'medium' : 'low'}">
                            <h4>${index + 1}. ${rec.id} (${rec.count} occurrences)</h4>
                            <p><strong>Issue:</strong> ${rec.description}</p>
                            <p><strong>Fix:</strong> ${rec.help}</p>
                            <p><strong>Impact:</strong> <span class="impact-badge impact-${rec.impact}">${rec.impact}</span></p>
                            <p><a href="${rec.helpUrl}" target="_blank">View detailed documentation →</a></p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div style="margin-top: 40px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
                <h3>🔗 Additional Resources</h3>
                <ul>
                    <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank">WCAG 2.1 Quick Reference</a></li>
                    <li><a href="https://webaim.org/articles/screenreader_testing/" target="_blank">Screen Reader Testing Guide</a></li>
                    <li><a href="https://www.deque.com/axe/" target="_blank">axe DevTools</a></li>
                    <li><a href="https://wave.webaim.org/" target="_blank">WAVE Web Accessibility Evaluator</a></li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`
  }

  generateSummary(results) {
    const totalViolations = results.reduce((sum, page) => sum + page.violations.length, 0)
    const totalPages = results.length
    const passedPages = results.filter(page => page.violations.length === 0).length
    
    const violationsByImpact = results.reduce((acc, page) => {
      page.violations.forEach(violation => {
        acc[violation.impact] = (acc[violation.impact] || 0) + 1
      })
      return acc
    }, {})

    return {
      totalPages,
      passedPages,
      failedPages: totalPages - passedPages,
      totalViolations,
      violationsByImpact,
      complianceRate: Math.round((passedPages / totalPages) * 100)
    }
  }

  processResults(results) {
    return results.map(page => ({
      ...page,
      violationsByImpact: page.violations.reduce((acc, violation) => {
        acc[violation.impact] = acc[violation.impact] || []
        acc[violation.impact].push(violation)
        return acc
      }, {}),
      status: page.violations.length === 0 ? 'passed' : 'failed'
    }))
  }

  generateRecommendations(results) {
    const allViolations = results.flatMap(page => page.violations)
    const violationCounts = {}
    
    // Count frequency of each violation type
    allViolations.forEach(violation => {
      violationCounts[violation.id] = (violationCounts[violation.id] || 0) + 1
    })
    
    // Sort by frequency and generate recommendations
    return Object.entries(violationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // Top 10 most common issues
      .map(([violationId, count]) => {
        const violation = allViolations.find(v => v.id === violationId)
        return {
          id: violationId,
          count,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          priority: this.calculatePriority(violation.impact, count)
        }
      })
  }

  calculatePriority(impact, frequency) {
    const impactWeight = {
      critical: 4,
      serious: 3,
      moderate: 2,
      minor: 1
    }
    
    return (impactWeight[impact] || 1) * frequency
  }
}

module.exports = AccessibilityReportGenerator
