import { FC } from 'react';
import { Section } from './Section';
import { Title, P } from './Typographies';
import { IonCard, IonCardHeader, IonCardTitle, IonContent, IonPage, IonTitle } from '@ionic/react';
import { Header } from '../Controls/Header';
import { BackButton } from '../Controls/BackButton';

export const Terms: FC = () => (
  <IonPage>
    <Header>
      <BackButton>/about</BackButton>
      <IonTitle>WeWish</IonTitle>
    </Header>
    <IonContent>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Terms of Service</IonCardTitle>
        </IonCardHeader>
        <Section>
          <Title>Terms</Title>
          <P>
            By accessing the website at <a href="https://wewish.app">https://wewish.app</a>,
            you are agreeing to be bound by these terms of service, all applicable laws and
            regulations, and agree that you are responsible for compliance with any applicable
            local laws. If you do not agree with any of these terms, you are prohibited from
            using or accessing this site. The materials contained in this website are protected
            by applicable copyright and trademark law.
          </P>
        </Section>

        <Section>
          <Title>Use License</Title>
          <P>
            <ol type="a">
              <li>
                Permission is granted to temporarily download one copy of the materials
                (information or software) on WeWish's website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
                <ol type="i">
                  <li>modify or copy the materials;</li>
                  <li>
                    use the materials for any commercial purpose, or for any public
                    display (commercial or non-commercial);
                  </li>
                  <li>attempt to decompile or reverse engineer any software contained on WeWish's website;</li>
                  <li>remove any copyright or other proprietary notations from the materials; or</li>
                  <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ol>
              </li>
              <li>
                This license shall automatically terminate if you violate any of these
                restrictions and may be terminated by WeWish at any time. Upon terminating
                your viewing of these materials or upon the termination of this license,
                you must destroy any downloaded materials in your possession whether in
                electronic or printed format.
              </li>
            </ol>
          </P>
        </Section>
        <Section>
          <Title>Disclaimer</Title>
          <P>
            <ol type="a">
              <li>
                The materials on WeWish's website are provided on an 'as is' basis.
                WeWish makes no warranties, expressed or implied, and hereby disclaims
                and negates all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular
                purpose, or non-infringement of intellectual property or other violation
                of rights.
              </li>
              <li>
                Further, WeWish does not warrant or make any representations concerning
                the accuracy, likely results, or reliability of the use of the materials
                on its website or otherwise relating to such materials or on any sites
                linked to this site.
              </li>
            </ol>
          </P>
        </Section>
        <Section>
          <Title>Limitations</Title>
          <P>
            In no event shall WeWish or its suppliers be liable for any damages (including,
            without limitation, damages for loss of data or profit, or due to business interruption)
            arising out of the use or inability to use the materials on WeWish's website, even if
            WeWish or a WeWish authorized representative has been notified orally or in writing of
            the possibility of such damage. Because some jurisdictions do not allow limitations on
            implied warranties, or limitations of liability for consequential or incidental damages,
            these limitations may not apply to you.
          </P>
        </Section>
        <Section>
          <Title>Accuracy of materials</Title>
          <P>
            The materials appearing on WeWish's website could include technical, typographical,
            or photographic errors. WeWish does not warrant that any of the materials on its
            website are accurate, complete or current. WeWish may make changes to the materials
            contained on its website at any time without notice. However WeWish does not make
            any commitment to update the materials.
          </P>
        </Section>
        <Section>
          <Title>Links</Title>
          <P>
            WeWish has not reviewed all of the sites linked to its website and is not responsible
            for the contents of any such linked site. The inclusion of any link does not imply
            endorsement by WeWish of the site. Use of any such linked website is at the user's own risk.
          </P>
        </Section>
        <Section>
          <Title>Modifications</Title>
          <P>
            WeWish may revise these terms of service for its website at any time without notice.
            By using this website you are agreeing to be bound by the then current version of
            these terms of service.
          </P>
        </Section>
        <Section>
          <Title>Governing Law</Title>
          <P>
            These terms and conditions are governed by and construed in accordance with the laws
            of Denmark and you irrevocably submit to the exclusive jurisdiction of the courts in
            that State or location.
          </P>
        </Section>
      </IonCard>
    </IonContent>
  </IonPage>
)
