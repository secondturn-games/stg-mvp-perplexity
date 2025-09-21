'use client'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from '@/components/ui/card'
import {
  Heading,
  Paragraph,
  Text
} from '@/components/ui/typography'
import {
  PrimaryButton,
  SecondaryButton
} from '@/components/ui/button'
import {
  SuccessBadge,
  InfoBadge
} from '@/components/ui/badge'

/**
 * Google Fonts Examples
 * Demonstrates Lato and Righteous fonts with Latvian character support
 */
export function FontExamples() {
  // Latvian text samples for testing character rendering
  const latvianSamples = {
    alphabet: 'ā, č, ē, ģ, ī, ķ, ļ, ņ, š, ū, ž',
    words: [
      'spēle', // game
      'galda spēles', // board games
      'stratēģija', // strategy
      'sākums', // beginning
      'beigas', // end
      'uzvarētājs', // winner
      'spēlētājs', // player
      'kārtis', // cards
      'kauliņi', // dice
      'figūriņas', // pieces
    ],
    sentences: [
      'Labākās galda spēles Latvijā!',
      'Pērk, pārdod un atklāj brīnišķīgas galda spēles.',
      'Stratēģiskas spēles visai ģimenei.',
      'Pievienojies tūkstošiem galda spēļu entuziastu Latvijā.',
    ]
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <Heading level={1} className="font-display text-4xl mb-4">
          Google Fonts Integration
        </Heading>
        <Paragraph variant="secondary" size="lg" className="font-sans">
          Lato & Righteous fonts with Latin Extended support for Latvian characters
        </Paragraph>
      </div>

      {/* Font Showcase */}
      <section className="space-y-8">
        <Heading level={2} variant="primary" className="font-display">
          Font Family Showcase
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lato Font (Sans) */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary" className="font-sans">
                Lato Font (Body Text)
              </Heading>
              <Text variant="secondary" size="sm" className="font-sans">
                Primary font with Latin Extended support
              </Text>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="font-sans font-normal text-textPrimary">
                  <strong>Regular (400):</strong> The quick brown fox jumps over the lazy dog
                </div>
                <div className="font-sans font-bold text-textPrimary">
                  <strong>Bold (700):</strong> The quick brown fox jumps over the lazy dog
                </div>
              </div>
              
              <div className="border-t border-borderLight pt-4">
                <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                  Latvian Characters Test:
                </Text>
                <div className="space-y-2 font-sans">
                  <div className="text-textPrimary">
                    <strong>Alphabet:</strong> {latvianSamples.alphabet}
                  </div>
                  <div className="text-textSecondary text-sm">
                    <strong>Words:</strong> {latvianSamples.words.join(', ')}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-borderLight pt-4">
                <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                  Sample Sentences:
                </Text>
                <div className="space-y-2 font-sans">
                  {latvianSamples.sentences.map((sentence, index) => (
                    <div key={index} className="text-textSecondary">
                      {sentence}
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Righteous Font (Display) */}
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary" className="font-display">
                Righteous Font (Display)
              </Heading>
              <Text variant="secondary" size="sm" className="font-sans">
                Display font for headings and special text
              </Text>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="font-display text-2xl text-textPrimary">
                  Display Heading Example
                </div>
                <div className="font-display text-lg text-vibrantOrange">
                  Brand Display Text
                </div>
                <div className="font-display text-base text-darkGreen">
                  Special Announcements
                </div>
              </div>
              
              <div className="border-t border-borderLight pt-4">
                <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                  Latvian Characters Test:
                </Text>
                <div className="space-y-2">
                  <div className="font-display text-lg text-textPrimary">
                    {latvianSamples.alphabet}
                  </div>
                  <div className="font-display text-vibrantOrange">
                    Galda Spēles Latvijā
                  </div>
                  <div className="font-display text-darkGreen">
                    Stratēģiskas Spēles
                  </div>
                </div>
              </div>
              
              <div className="border-t border-borderLight pt-4">
                <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                  Display Headlines:
                </Text>
                <div className="space-y-2">
                  <div className="font-display text-xl text-textPrimary">
                    Labākās Galda Spēles
                  </div>
                  <div className="font-display text-lg text-vibrantOrange">
                    Pievienojies Mūsu Kopienai
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Typography Hierarchy */}
      <section className="space-y-8">
        <Heading level={2} variant="primary" className="font-display">
          Typography Hierarchy
        </Heading>
        
        <Card>
          <CardHeader>
            <Heading level={3} variant="primary" className="font-display">
              Complete Typography Scale
            </Heading>
            <Paragraph variant="secondary" className="font-sans">
              Demonstrating the combination of Lato (body) and Righteous (display) fonts
            </Paragraph>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Headings with Display Font */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl text-textPrimary">
                H1 Display - Second Turn Games
              </h1>
              <h2 className="font-display text-3xl text-vibrantOrange">
                H2 Display - Galda Spēļu Tirgus
              </h2>
              <h3 className="font-display text-2xl text-darkGreen">
                H3 Display - Stratēģiskas Spēles
              </h3>
              <h4 className="font-display text-xl text-textPrimary">
                H4 Display - Spēļu Kolekcija
              </h4>
              <h5 className="font-display text-lg text-textSecondary">
                H5 Display - Jauni Piedāvājumi
              </h5>
              <h6 className="font-display text-base text-textMuted">
                H6 Display - Papildu Informācija
              </h6>
            </div>
            
            {/* Body Text with Sans Font */}
            <div className="border-t border-borderLight pt-6 space-y-4">
              <Paragraph variant="primary" size="lg" className="font-sans">
                <strong>Large Body Text (Lato):</strong> Atklājiet brīnišķīgas galda spēles no līdzīgi domājošiem entuziastiem Latvijā. Mūsu tirgus piedāvā stratēģiskas spēles, ģimenes spēles un retus atklājumus.
              </Paragraph>
              
              <Paragraph variant="primary" className="font-sans">
                <strong>Regular Body Text (Lato):</strong> Pārlūkojiet mūsu tirgu, lai atrastu stratēģijas spēles, ģimenes spēles un retus atklājumus. Visas spēles ir pārbaudītas un novērtētas mūsu kopienas.
              </Paragraph>
              
              <Paragraph variant="secondary" className="font-sans">
                <strong>Secondary Text (Lato):</strong> Pievienojieties tūkstošiem galda spēļu entuziastu Latvijā un atklājiet jaunas spēles katru dienu.
              </Paragraph>
              
              <Paragraph variant="muted" size="sm" className="font-sans">
                <strong>Small Text (Lato):</strong> Visi lietotāji tiek verificēti, lai nodrošinātu drošu un uzticamu tirdzniecības vidi.
              </Paragraph>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-8">
        <Heading level={2} variant="primary" className="font-display">
          Real-World Usage Examples
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Game Listing Card */}
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-vibrantOrange/20 to-darkGreen/20 flex items-center justify-center">
              <div className="text-center">
                <div className="font-display text-2xl text-vibrantOrange mb-2">
                  Galda Spēle
                </div>
                <div className="font-sans text-textMuted">
                  Image Placeholder
                </div>
              </div>
            </div>
            <CardBody>
              <h3 className="font-display text-xl text-textPrimary mb-2">
                Catan: Pilsētas & Bruņinieki
              </h3>
              <div className="font-sans text-textSecondary text-sm mb-3">
                Stratēģija • 3-4 Spēlētāji • 90 min
              </div>
              <div className="font-sans text-2xl font-bold text-textPrimary mb-3">
                €45.00
              </div>
              <div className="flex items-center justify-between font-sans text-sm text-textSecondary">
                <span>Jānis Bērziņš</span>
                <span>Rīga</span>
              </div>
              <div className="font-sans text-xs text-textMuted mt-2">
                Publicēts pirms 2 dienām
              </div>
            </CardBody>
            <CardFooter>
              <PrimaryButton className="w-full font-sans">
                Sazināties ar Pārdevēju
              </PrimaryButton>
            </CardFooter>
          </Card>

          {/* Feature Card */}
          <Card>
            <CardHeader>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <Heading level={3} variant="primary" className="font-display mb-2">
                  Verificētas Spēles
                </Heading>
              </div>
            </CardHeader>
            <CardBody>
              <Paragraph variant="secondary" className="font-sans text-center">
                Visas spēles tiek verificētas caur BoardGameGeek datubāzi, lai nodrošinātu precīzu informāciju.
              </Paragraph>
            </CardBody>
            <CardFooter className="justify-center">
              <SuccessBadge>BGG Verificēts</SuccessBadge>
            </CardFooter>
          </Card>

          {/* User Profile Card */}
          <Card>
            <CardBody>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-darkGreen/10 rounded-full flex items-center justify-center">
                  <span className="font-display text-xl text-darkGreen">JB</span>
                </div>
                <div>
                  <h4 className="font-display text-lg text-textPrimary">
                    Jānis Bērziņš
                  </h4>
                  <div className="font-sans text-textSecondary text-sm">
                    Galda spēļu entuzjasts
                  </div>
                  <div className="font-sans text-textMuted text-xs">
                    Rīga, Latvija
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-borderLight">
                <div className="text-center">
                  <div className="font-display text-xl text-textPrimary">24</div>
                  <div className="font-sans text-textMuted text-xs">Sludinājumi</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-xl text-textPrimary">4.8</div>
                  <div className="font-sans text-textMuted text-xs">Vērtējums</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-xl text-textPrimary">156</div>
                  <div className="font-sans text-textMuted text-xs">Pārdošanas</div>
                </div>
              </div>
              
              <Paragraph variant="secondary" size="sm" className="font-sans mt-4">
                Aizrautīgs kolekcionārs ar vairāk nekā 10 gadu pieredzi. Specializējas stratēģijas spēlēs.
              </Paragraph>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Character Rendering Test */}
      <section className="space-y-8">
        <Heading level={2} variant="primary" className="font-display">
          Latvian Character Rendering Test
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary" className="font-display">
                Lato Font Test
              </Heading>
              <Text variant="secondary" className="font-sans">
                Testing all Latvian special characters in body font
              </Text>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="font-sans">
                <Text variant="primary" weight="medium" className="block mb-2">
                  Special Characters:
                </Text>
                <div className="text-2xl text-textPrimary mb-4">
                  {latvianSamples.alphabet}
                </div>
              </div>
              
              <div className="font-sans">
                <Text variant="primary" weight="medium" className="block mb-2">
                  Sample Words:
                </Text>
                <div className="grid grid-cols-2 gap-2 text-textSecondary">
                  {latvianSamples.words.map((word, index) => (
                    <div key={index} className="p-2 bg-surface-50 rounded text-center">
                      {word}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="font-sans">
                <Text variant="primary" weight="medium" className="block mb-2">
                  Complete Sentences:
                </Text>
                <div className="space-y-2">
                  {latvianSamples.sentences.map((sentence, index) => (
                    <div key={index} className="p-3 bg-surface-50 rounded text-textPrimary">
                      {sentence}
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3} variant="primary" className="font-display">
                Righteous Font Test
              </Heading>
              <Text variant="secondary" className="font-sans">
                Testing Latvian characters in display font
              </Text>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                  Special Characters:
                </Text>
                <div className="font-display text-2xl text-vibrantOrange mb-4">
                  {latvianSamples.alphabet}
                </div>
              </div>
              
              <div>
                <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                  Display Headlines:
                </Text>
                <div className="space-y-3">
                  <div className="font-display text-xl text-textPrimary">
                    Galda Spēļu Veikals
                  </div>
                  <div className="font-display text-lg text-vibrantOrange">
                    Stratēģiskas Spēles
                  </div>
                  <div className="font-display text-base text-darkGreen">
                    Ģimenes Izklaide
                  </div>
                </div>
              </div>
              
              <div>
                <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                  Marketing Headlines:
                </Text>
                <div className="space-y-2">
                  <div className="font-display text-lg text-vibrantOrange text-center p-3 bg-vibrantOrange/5 rounded">
                    Labākās Galda Spēles Latvijā!
                  </div>
                  <div className="font-display text-base text-darkGreen text-center p-3 bg-darkGreen/5 rounded">
                    Pievienojies Mūsu Kopienai
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Font Usage Guidelines */}
      <section className="space-y-8">
        <Heading level={2} variant="primary" className="font-display">
          Font Usage Guidelines
        </Heading>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <Heading level={3} variant="primary" className="font-display">
                When to Use Each Font
              </Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-surface-50 rounded-lg">
                  <div className="font-display text-lg text-vibrantOrange mb-2">
                    Righteous (Display)
                  </div>
                  <ul className="font-sans text-textSecondary text-sm space-y-1">
                    <li>• Main page headings (H1, H2)</li>
                    <li>• Brand names and logos</li>
                    <li>• Marketing headlines</li>
                    <li>• Call-to-action buttons</li>
                    <li>• Special announcements</li>
                    <li>• Game titles in featured cards</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-surface-50 rounded-lg">
                  <div className="font-sans text-lg text-darkGreen font-bold mb-2">
                    Lato (Body)
                  </div>
                  <ul className="font-sans text-textSecondary text-sm space-y-1">
                    <li>• All body text and paragraphs</li>
                    <li>• Form labels and inputs</li>
                    <li>• Navigation menus</li>
                    <li>• Descriptions and details</li>
                    <li>• User interface text</li>
                    <li>• Secondary headings (H3-H6)</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3} variant="primary" className="font-display">
                CSS Classes & Examples
              </Heading>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                    Tailwind Classes:
                  </Text>
                  <div className="bg-surface-100 p-3 rounded text-xs font-mono space-y-1">
                    <div><code>font-sans</code> - Lato (body text)</div>
                    <div><code>font-display</code> - Righteous (headings)</div>
                    <div><code>font-mono</code> - Geist Mono (code)</div>
                    <div><code>font-serif</code> - System serif</div>
                  </div>
                </div>
                
                <div>
                  <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                    Example Usage:
                  </Text>
                  <div className="bg-surface-100 p-3 rounded text-xs font-mono space-y-1">
                    <div>{`<h1 className="font-display text-4xl">`}</div>
                    <div>{`  Galda Spēles`}</div>
                    <div>{`</h1>`}</div>
                    <div className="mt-2">{`<p className="font-sans text-base">`}</div>
                    <div>{`  Atklājiet brīnišķīgas spēles...`}</div>
                    <div>{`</p>`}</div>
                  </div>
                </div>
                
                <div>
                  <Text variant="primary" weight="medium" className="block mb-2 font-sans">
                    Button Examples:
                  </Text>
                  <div className="space-y-2">
                    <PrimaryButton className="w-full font-display">
                      Pārdot Spēles
                    </PrimaryButton>
                    <SecondaryButton className="w-full font-sans">
                      Apskatīt Visas Spēles
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Performance Information */}
      <section className="space-y-6">
        <Heading level={2} variant="primary" className="font-display">
          Performance & Optimization
        </Heading>
        
        <Card>
          <CardHeader>
            <Heading level={3} variant="primary" className="font-display">
              Font Loading Strategy
            </Heading>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Text variant="primary" weight="medium" className="block font-sans">
                  Optimization Features:
                </Text>
                <ul className="font-sans text-textSecondary space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-teal rounded-full"></span>
                    <span><code>display: 'swap'</code> for better performance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-teal rounded-full"></span>
                    <span>Latin Extended subset for Latvian characters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-teal rounded-full"></span>
                    <span>Automatic font optimization by Next.js</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-teal rounded-full"></span>
                    <span>Proper fallback fonts for loading states</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <Text variant="primary" weight="medium" className="block font-sans">
                  Character Support:
                </Text>
                <div className="font-sans text-textSecondary space-y-2">
                  <div className="p-3 bg-surface-50 rounded">
                    <strong>Latvian Alphabet:</strong><br />
                    <span className="text-lg">{latvianSamples.alphabet}</span>
                  </div>
                  <div className="p-3 bg-surface-50 rounded">
                    <strong>Display Font:</strong><br />
                    <span className="font-display text-lg text-vibrantOrange">
                      {latvianSamples.alphabet}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* CSS Reference */}
      <section className="space-y-6">
        <Heading level={2} variant="primary" className="font-display">
          Quick Reference
        </Heading>
        
        <Card>
          <CardHeader>
            <Heading level={3} variant="primary" className="font-display">
              Font Class Reference
            </Heading>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Text variant="primary" weight="medium" className="block font-sans">
                  Font Families:
                </Text>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <code className="font-mono">font-sans</code>
                    <span className="font-sans">Lato (Body)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <code className="font-mono">font-display</code>
                    <span className="font-display">Righteous (Display)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <code className="font-mono">font-mono</code>
                    <span className="font-mono">Geist Mono (Code)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-surface-50 rounded">
                    <code className="font-mono">font-serif</code>
                    <span className="font-serif">System Serif</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Text variant="primary" weight="medium" className="block font-sans">
                  Usage Examples:
                </Text>
                <div className="bg-surface-100 p-4 rounded text-xs font-mono space-y-1">
                  <div>{`<!-- Main heading -->`}</div>
                  <div>{`<h1 className="font-display text-4xl">`}</div>
                  <div>{`  Second Turn Games`}</div>
                  <div>{`</h1>`}</div>
                  <div className="mt-2">{`<!-- Body text -->`}</div>
                  <div>{`<p className="font-sans text-base">`}</div>
                  <div>{`  Galda spēļu tirgus Latvijā`}</div>
                  <div>{`</p>`}</div>
                  <div className="mt-2">{`<!-- Button -->`}</div>
                  <div>{`<button className="font-display">`}</div>
                  <div>{`  Pārdot Spēles`}</div>
                  <div>{`</button>`}</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}
