import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { portfolioData } from '../src/data/portfolioData.js';

describe('Portfolio Data & Static Assets Integrity', () => {
  it('contains valid personal metadata and contact fields', () => {
    const { personal } = portfolioData;
    assert.strictEqual(personal.name, 'Nithish Athilingam');
    assert.ok(personal.title.includes('Software Engineer'));
    assert.ok(personal.email.includes('@'));
    assert.strictEqual(personal.resumeUrl, '/resume.pdf');
  });

  it('verifies public/resume.pdf exists and is non-empty', () => {
    const resumePath = path.resolve(process.cwd(), 'public', 'resume.pdf');
    assert.ok(fs.existsSync(resumePath), 'public/resume.pdf should exist on disk');
    const stats = fs.statSync(resumePath);
    assert.ok(stats.size > 1000, 'public/resume.pdf should not be empty');
  });

  it('includes all required skill categories, Salesforce/Spring Boot, and AWS Serverless stack', () => {
    const categories = portfolioData.skills.map((s) => s.category);
    assert.ok(categories.includes('Programming Languages'));
    assert.ok(categories.includes('Frameworks & Libraries'));
    assert.ok(categories.includes('Cloud, Systems & DevOps'));

    const languagesCategory = portfolioData.skills.find(
      (s) => s.category === 'Programming Languages'
    );
    assert.ok(languagesCategory.items.includes('Apex (Salesforce)'));

    const frameworksCategory = portfolioData.skills.find(
      (s) => s.category === 'Frameworks & Libraries'
    );
    assert.ok(frameworksCategory.items.includes('Spring Boot'));

    const cloudCategory = portfolioData.skills.find(
      (s) => s.category === 'Cloud, Systems & DevOps'
    );
    assert.ok(cloudCategory, 'Cloud category should exist');
    assert.ok(cloudCategory.items.includes('Salesforce Platform & SFDX'));

    const awsEntry = cloudCategory.items.find((item) => item.startsWith('AWS'));
    assert.ok(awsEntry, 'AWS skill entry should exist');
    for (const service of ['S3', 'CloudFront', 'Lambda', 'API Gateway', 'SES', 'IAM', 'Route 53']) {
      assert.ok(
        awsEntry.includes(service),
        `AWS skill entry should mention ${service}`
      );
    }
  });

  it('validates all featured projects have required structure and tags', () => {
    assert.ok(Array.isArray(portfolioData.projects));
    assert.ok(portfolioData.projects.length >= 6);

    for (const project of portfolioData.projects) {
      assert.ok(project.id, 'Project must have an id');
      assert.ok(project.title, `Project ${project.id} must have a title`);
      assert.ok(project.description, `Project ${project.id} must have a description`);
      assert.ok(Array.isArray(project.tags) && project.tags.length > 0);
    }

    const claimSyncProject = portfolioData.projects.find(
      (p) => p.id === 'claimsync-salesforce-springboot'
    );
    assert.ok(claimSyncProject, 'ClaimSync Salesforce & Spring Boot project must exist');
    assert.ok(claimSyncProject.tags.includes('Salesforce Apex'));
    assert.ok(claimSyncProject.tags.includes('Spring Boot'));

    const awsProject = portfolioData.projects.find(
      (p) => p.id === 'serverless-portfolio-aws'
    );
    assert.ok(awsProject, 'Serverless portfolio project must exist');
    assert.ok(awsProject.description.includes('API Gateway'));
    assert.ok(awsProject.description.includes('Lambda'));
    assert.ok(awsProject.description.includes('Amazon SES'));
  });

  it('validates experience, certifications, and education records', () => {
    assert.ok(Array.isArray(portfolioData.experience) && portfolioData.experience.length > 0);
    assert.ok(Array.isArray(portfolioData.certifications) && portfolioData.certifications.length >= 3);
    assert.ok(Array.isArray(portfolioData.education) && portfolioData.education.length > 0);

    for (const cert of portfolioData.certifications) {
      assert.ok(cert.name);
      assert.ok(cert.issuer);
      assert.ok(cert.url.startsWith('https://'));
    }
  });
});
