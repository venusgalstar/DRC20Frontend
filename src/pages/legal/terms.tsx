import PageBase from '../_base'

import '../index.css'

const Terms = () => {
  return (
    <PageBase>
      <div className="mx-auto max-w-4xl text-left">
        <h1 className="text-3xl font-bold my-4">Terms of Service for Doge Labs</h1>
        <p className="my-2">Last Revision Date: November 2023</p>

        {/* Introduction */}
        <p className="my-2">
          We urge you to carefully read our Terms of Service ("Terms"), as they dictate your interaction with the Doge
          Labs website and interface at <a href="https://drc-20.org/">https://drc-20.org/</a> ("Site" or "Doge Labs
          Platform"). Our platform allows interaction with certain decentralized cryptographic protocols (which we
          neither own nor control) ("Protocols") to facilitate the creation and distribution ("minting") of Doginals
          including drc-20 token ("Doginals") and supports the sale and distribution of these Doginals on decentralized
          blockchains where the Doginals are recorded ("Blockchain"). For ease of reference, the Site, our services, and
          App are collectively referred to as the "Services".
        </p>

        {/* Arbitration Notice */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">CRUCIAL NOTICE ABOUT ARBITRATION</h2>
        <p className="my-2">
          By accepting these Terms, you agree (with limited exceptions) to settle any disputes with Doge Labs via
          binding, individual arbitration rather than in court. Please review Section ‎17 “Resolution of Disputes” for
          detailed information on arbitration. However, if the laws of your residence prohibit mandatory arbitration,
          then the arbitration agreement in Section ‎17 does not apply, but the provisions of Section ‎16 (Legal
          Jurisdiction) will be effective instead.
        </p>

        {/* Agreement to Terms */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Agreement to Terms</h2>
        <p className="my-2">
          By using our Services, you consent to these Terms. If you do not agree, you are not authorized to use the
          Services.
        </p>

        {/* Privacy Policy */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Privacy Policy</h2>
        <p className="my-2">
          Our Privacy Policy, which outlines how we handle your information, also governs your use of the Services.
        </p>

        {/* Modifications to Terms or Services */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Modifications to Terms or Services</h2>
        <p className="my-2">
          We may modify the Terms at our discretion. Should changes occur, we'll announce them on the Site, App, or
          through other communications. It's crucial to review the Terms whenever they are updated or when you use the
          Services. Continuing to use the Services after updates signifies your acceptance of the changes. If you do not
          accept the updated Terms, you must stop using the Services. We may alter or discontinue any part of the
          Services at our discretion without notice.
        </p>

        {/* Who May Use the Services */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Who May Use the Services?</h2>
        <h3 className="text-xl font-semibold mt-6 mb-2">Eligibility</h3>
        <p className="my-2">
          You must be at least 18 years old and able to form a binding contract with Doge Labs to use the Services. In
          compliance with the Children’s Online Privacy Protection Act (“COPPA”), we do not knowingly collect
          information from users under 13. Do not use our Services if you are under 13. If we discover that a user is
          under 13, we will promptly delete their personal information. To report a user under 13, email
          doginal.wuff@gmail.com.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Compliance</h3>
        <p className="my-2">
          The Services are available only in certain jurisdictions and must be used in accordance with applicable laws.
          You confirm compliance with all applicable laws (e.g., local, state, federal, and others) when using the
          Services. By using the Services, you represent and warrant that you are not located in the United States. You
          are solely responsible for complying with your individual local laws. You must not use any software or
          techniques, such as VPNs, to alter your IP address or bypass restrictions. We reserve the right to monitor
          access locations and restrict Service access based on geographic locations, IP addresses, or unique device
          identifiers.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Unauthorized Access</h3>
        <p className="my-2">
          You must not access the Site or Services for web crawling, data mining, scraping, or similar activities
          without our written consent. To engage in such activities, contact us at doginal.wuff@gmail.com for approval
          and API access. Unauthorized engagement in these activities constitutes a breach of these Terms and may lead
          to legal liability.
        </p>

        {/* About the Services */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">About the Services</h2>
        <h3 className="text-xl font-semibold mt-6 mb-2">The Doge Labs Platform</h3>
        <p className="my-2">
          Our Services enable interaction with Protocols and Blockchains for bidding, purchasing, trading, and selling
          Doginals. While Doge Labs provides the interface (Doge Labs Platform), we do not provide the Protocols. Our
          Services also allow users to create and deploy Doginals.
        </p>
        <p className="my-2">
          You can participate in the Services by linking your digital wallets. To sell or buy digital assets, you must
          download a supported wallet extension and connect your digital wallets. Once you submit a sell or buy order,
          the transaction is processed by the applicable extension.
        </p>
        <p className="my-2">
          Doge Labs Platform is not a broker, financial institution, or creditor. It is merely an administrative
          platform. Doge Labs facilitates transactions between buyers and sellers on the Doge Labs Platform but is not a
          party to any agreement between them.
        </p>
        <p className="my-2">
          You are solely responsible for verifying the identity, legitimacy, and authenticity of assets purchased
          through the Doge Labs Platform. Doge Labs makes no claims regarding the identity, legitimacy, or authenticity
          of assets on the platform.
        </p>

        {/* Transactions on the Blockchain */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Transactions on the Blockchain</h2>
        <p className="my-2">
          Doge Labs provides a platform for Doginals but does not buy, sell, or take custody of Doginals, nor act as an
          agent or custodian for users. Transactions occur through the relevant Blockchain network. You are required to
          conduct transactions exclusively through the connected cryptocurrency wallet. We have no insight or control
          over these transactions and cannot reverse them. You may be subject to royalties on secondary Doginal sales,
          which may be self-executing via a blockchain network.
        </p>

        {/* Inscription Service */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Inscription Service</h2>
        <p className="my-2">
          Our Inscription Service allows users to request the minting of drc-20 tokens. It's important to understand the
          following key points before using this service:
        </p>
        <ul className="list-disc pl-5 my-4">
          <li className="mb-2">
            Token Supply Limitation. Tokens minted that exceed the maximum supply of a specific token might be deemed
            invalid. We urge users to conduct thorough research (DYOR) before initiating any minting requests.
          </li>
          <li className="mb-2">
            Minting and Maximum Supply. In cases where a token is nearing its maximum mint limit, it is possible that
            the maximum supply may be reached before your minting transaction is processed by the Dogecoin Network.
            Unfortunately, in such instances, we are unable to offer refunds.
          </li>
          <li className="mb-2">
            Minting Duration. The process of minting can vary significantly in duration, potentially taking several
            hours or days to complete.
          </li>
          <li className="mb-2">
            Irreversible Process. Once the minting process has begun, it cannot be halted or canceled.
          </li>
          <li className="mb-2">
            No Refund Policy. Should the minting process encounter failures or errors, we cannot issue refunds.
          </li>
          <li className="mb-2">
            Incorrect Address Transactions. No refunds will be provided in cases where DOGE is sent to an incorrect
            address.
          </li>
          <li className="mb-2">
            Minting Charges. Each minting request incurs a fee of 2 DOGE, in addition to any gas fees associated with
            the transaction. This charge applies per minting call with a 'limit per mint'. And additional premium fee
            might apply.
          </li>
          <li className="mb-2">
            Nature of Service. Our service is limited to the inscription of JSON files in a specified format. We do not
            sell or offer tokens directly.
          </li>
          <li className="mb-2">
            Dependence on Centralized Indexers. The recognition and validity of drc-20 inscriptions are subject to
            centralized indexers. We cannot ensure that these indexers will always acknowledge inscriptions made via our
            service as valid.
          </li>
          <li className="mb-2">
            Variable DOGE Amounts in Minting. The amount of $DOGE required for minting can fluctuate based on current
            gas prices. As a result, the actual drc-20 token amount you receive for the $DOGE transferred may be
            slightly more or less than anticipated.
          </li>
          <li className="mb-2">
            User Responsibility. Users are responsible for understanding the intricacies and risks involved in the
            minting process. By using our Inscription Service, you acknowledge these terms and accept the associated
            risks and limitations.
          </li>
        </ul>

        {/* Indexing */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Indexing</h2>
        <p className="my-2">
          Our Indexing is a cutting-edge feature focused on UTXO chains. It's crucial for users to understand several
          key aspects before utilizing this service:
        </p>
        <ul className="list-disc pl-5 my-4">
          <li className="mb-2">
            Experimental Nature. Indexing on UTXO chains is an experimental technology. While we strive for accuracy and
            reliability, the nature of this feature means it's continuously evolving.
          </li>
          <li className="mb-2">
            Centralized Rule Dependence. The service operates based on centralized rules, which may differ across
            various indexers. This can influence how transactions and balances are recorded and recognized.
          </li>
          <li className="mb-2">
            Dynamic Rule Changes. The rules guiding the indexing process are subject to change. Such changes could
            affect the validity and recognition of your transactions and balances.
          </li>
          <li className="mb-2">
            Acknowledgment of Risks. By engaging with our Indexing Service, you acknowledge and accept the risks
            associated with these potential changes and the experimental nature of the service.
          </li>
        </ul>

        {/* Promotion Programs */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Promotion Programs</h2>
        <p className="my-2">
          Participation in programs like promotions, sweepstakes, or contests via the Doge Labs Platform is subject to
          additional specific terms set by the program's sponsor.
        </p>

        {/* Terms for Purchasers and Sellers */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Terms for Purchasers and Sellers</h2>
        <h3 className="text-xl font-semibold mt-6 mb-2">Purchase Terms</h3>
        <p className="my-2">
          While Doginal sale terms are displayed on the Doge Labs Platform, they are determined by the buyers and
          sellers. The terms of Doginal transactions are between the buyer and seller. Doge Labs is not a party to these
          terms and is not responsible for ensuring compliance or resolving disputes. Both parties are responsible for
          establishing and enforcing the terms and resolving any disputes. Sellers must fulfill their obligations under
          these terms. When purchasing a Doginal, you own the rights to the electronic record of the Doginal but not
          necessarily the intellectual property rights in the Doginal Content, unless specified in the purchase terms.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Costs and Fees</h3>
        <p className="my-2">
          Transactions on the Doge Labs Platform may incur fees for supporting Doginal creators and the platform, as
          listed on the Site or in these Terms. "Revenue" means the total amount paid by a buyer. You agree to pay all
          applicable fees, including Gas Fees and hosting fees, and authorize Doge Labs to charge or deduct these fees
          from your payments. You are also responsible for taxes and transaction fees imposed by the Blockchain.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Revenue Share and Fees</h3>
        <p className="my-2">
          As a seller, you receive Revenue minus a Transaction Fee for each initial sale on the Doge Labs Platform. The
          Transaction Fee is a percentage of the Revenue and may change over time.
        </p>

        {/* Terms for Creators */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Terms for Creators</h2>
        <h3 className="text-xl font-semibold mt-6 mb-2">Doginal Content</h3>
        <p className="my-2">
          You retain ownership of the digital art in the Doginals and any related intellectual property rights. However,
          you grant Doge Labs a perpetual, worldwide license to use the Doginal Content for listing, marketing, and
          facilitating Doginal sales and promoting the Services.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Creator Obligations and Perks</h3>
        <p className="my-2">
          You are responsible for obtaining rights for the Doginal Content used by Doge Labs, and for the costs and
          compliance associated with the benefits offered in connection with your Doginal sales.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Promotions Tool</h3>
        <p className="my-2">
          Our Services may include a tool for administering promotions (contests, sweepstakes, etc.) ("Promotions
          Tool"). By using the Promotions Tool, you release Doge Labs from liability connected to the promotion and
          acknowledge that the promotion is not sponsored or endorsed by Doge Labs.
        </p>
        <p className="my-2">
          Administration of Promotion. You are responsible for the lawful operation of promotions administered via the
          Promotions Tool, including official rules, terms, eligibility requirements, and compliance with relevant laws
          and regulations.
        </p>
        <p className="my-2">
          Required Content. Promotions administered through the Promotions Tool must include specific provisions in
          their official rules, particularly regarding Doge Labs' non-involvement in the promotion's administration or
          fulfillment.
        </p>
        <p className="my-2">
          No Assistance. Doge Labs does not assist in the administration of your Promotion. Using the Promotions Tool is
          at your own risk.
        </p>
        <p className="my-2">
          Warranties. You warrant that you have the rights to grant licenses in these Terms, that the Doginal Content
          and its use comply with all laws and do not infringe on any third-party rights, and that you will fulfill your
          obligations to purchasers of the Doginals.
        </p>

        {/* Taxes */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Taxes</h2>
        <p className="my-2">
          You are solely responsible for all costs and taxes related to using the Services and for maintaining tax
          records and compliance.
        </p>

        {/* Suspension or Termination */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Suspension or Termination</h2>
        <p className="my-2">
          We may suspend or terminate your access to the Services as required by law or if we determine you are
          violating these Terms or third-party service terms. Suspension or termination does not constitute a breach of
          these Terms by Doge Labs. We may impose limitations on using the Services in line with our compliance
          policies.
        </p>

        {/* Feedback */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Feedback</h2>
        <p className="my-2">
          We welcome your feedback, comments, and suggestions ("Feedback") and may use them without restriction or
          compensation.
        </p>

        {/* Content You Provide */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Content You Provide</h2>
        <h3 className="text-xl font-semibold mt-6 mb-2">Content Sharing</h3>
        <p className="my-2">
          Our Services enable you to upload or share various forms of content like texts, images, audio, video, and
          other files. This content, excluding any feedback you provide, is termed "User Content." You retain all rights
          to your User Content, and our Terms do not limit your ownership of it.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">User Content Licensing</h3>
        <p className="my-2">
          When you share User Content via our Services, you grant Doge Labs a non-exclusive, transferable, global,
          royalty-free license with rights to sublicense. This license allows us to utilize, replicate, modify, produce
          derivative works from, distribute, display, and perform your User Content to operate and provide the Services.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Your Accountability for User Content</h3>
        <p className="my-2">
          You bear sole responsibility for all User Content you provide. You assure that you possess (and will maintain)
          the necessary rights to allow us the license rights for your User Content under these Terms. You also
          guarantee that your User Content will not infringe on any third party’s intellectual property, publicity,
          privacy rights, or violate any laws or regulations.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">User Content Removal</h3>
        <p className="my-2">
          You can delete your User Content from our Services, but note that in certain cases (like posts or comments),
          your User Content may not be completely removable and might persist in our Services or on the blockchain. We
          are not liable for the removal or failure to delete any of your User Content.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Doge Labs’ Intellectual Property Rights</h3>
        <p className="my-2">
          Content made available through our Services that is protected by intellectual property rights remains the
          property of Doge Labs.
        </p>

        {/* Usage Guidelines and Enforcement Rights of Doge Labs */}
        {/* Usage Guidelines and Enforcement Rights of Doge Labs */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Usage Guidelines and Enforcement Rights of Doge Labs</h2>
        {/* Include specific guidelines and enforcement rights here */}
        <p className="my-2">
          By using our Services, you consent to avoid certain actions. These include not sharing, posting, or
          distributing User Content that infringes on intellectual property rights, invades privacy, or is unlawful.
          Refrain from unauthorized access to restricted areas of the Services or Doge Labs’ systems. Do not manipulate
          data packets or use the Services to disseminate misleading information. You are responsible for abiding by all
          applicable laws and not encouraging others to violate these guidelines. Doge Labs retains the right, but not
          the obligation, to monitor and manage the Services, including the removal of content in violation of these
          Terms.
        </p>

        {/* Copyright Compliance */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Copyright Compliance</h2>
        <p className="my-2">
          Doge Labs respects intellectual property laws and will terminate users who repeatedly infringe on copyrights.
          For more details, see our Copyright Policy.
        </p>

        {/* Third-Party Links and Resources */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Links and Resources</h2>
        <p className="my-2">
          The Services may include links to third-party resources. We are not responsible for the content or services of
          these external resources and you use them at your own risk.
        </p>

        {/* Service Termination */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Service Termination</h2>
        <p className="my-2">
          Doge Labs may modify, suspend, or terminate your access to the Services at any time without notice. You can
          also disconnect your digital wallet anytime. Certain provisions will remain in effect after termination.
        </p>

        {/* Warranty Disclaimers */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Warranty Disclaimers</h2>
        <p className="my-2">
          The Services are provided without any warranties, express or implied. We do not guarantee uninterrupted,
          secure, or error-free service. We are not liable for content accuracy, security breaches, or data loss. The
          responsibility for using the Services safely and securely lies with you.
        </p>

        {/* Risk Awareness and Acceptance */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Risk Awareness and Acceptance</h2>
        {/* Include details about risk awareness and acceptance */}
        <p className="my-2">
          You accept and acknowledge various risks associated with using digital currencies and blockchain technology.
          This includes recognizing the pricing and availability of cryptocurrency assets are subject to extreme
          fluctuations. Acknowledge the inherent risks involved in using digital currencies via the internet and
          understand that we are not accountable for any of these variables or risks and cannot be held responsible for
          any resulting losses incurred while accessing the Services.
        </p>

        {/* Obligation to Compensate */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Obligation to Compensate</h2>
        {/* Include details about the obligation to compensate */}
        <p className="my-2">
          You are obligated to compensate, defend, and absolve Doge Labs from any kind of legal claims, conflicts,
          demands, and related costs connected to your usage of the Services, your content, or any breach of the Terms.
          This includes indemnifying Doge Labs from legal actions and disputes arising from your failure to adhere to
          your own representations and warranties.
        </p>

        {/* Restriction of Responsibility */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Restriction of Responsibility</h2>
        {/* Include details about the restriction of responsibility */}
        <p className="my-2">
          Under the fullest extent allowable by law, Doge Labs will not be responsible for any incidental, special,
          exemplary, or consequential damages. This applies regardless of the basis of the claim and even if Doge Labs
          or its service providers were previously made aware of the possibility of such damages. The total cumulative
          liability of Doge Labs connected with these Terms shall not exceed the total amount you have paid to Doge Labs
          for the Services, or one hundred U.S. dollars ($100), if you have had no payment obligations to Doge Labs.
        </p>

        {/* Legal Jurisdiction */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Legal Jurisdiction</h2>
        <p className="my-2">
          These Terms are governed by German state law. Disputes will be resolved through arbitration or in courts
          located in Hamburg, Germany.
        </p>

        {/* Resolution of Disputes */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Resolution of Disputes</h2>
        {/* Include details about the resolution of disputes */}
        <p className="my-2">
          Initial Informal Dispute Resolution requires engagement in an effort to informally resolve any disputes.
          Binding Arbitration of Disputes means that both parties agree to resolve any disputes exclusively through
          binding, individual arbitration. Specific Exceptions and details about Arbitration Costs and Relief Through
          Arbitration should be outlined here.
        </p>

        {/* Comprehensive Terms and Conditions */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">Comprehensive Terms and Conditions</h2>
        <p className="my-2">
          This document represents the complete, sole, and exclusive agreement between you and Doge Labs concerning the
          Services. It supersedes all previous oral or written agreements between you and Doge Labs regarding the
          Services. Should any term of this agreement be deemed invalid or unenforceable by an arbitrator or competent
          court, that term will be enforced to the fullest extent allowed, while the remaining terms will continue in
          full effect. These Terms are not assignable or transferable by you, except as allowed by applicable law,
          without prior written consent from Doge Labs. Any attempt to assign or transfer these Terms without such
          consent will be void. Doge Labs can assign or transfer these Terms freely. These Terms are binding and will
          benefit both parties, their successors, and permitted assigns.
        </p>
        <p className="my-2">
          Notice Procedure. Doge Labs will communicate any notices or other messages under these Terms either via email
          or by posting to the Services. For email notices, the date of receipt is the day the email is transmitted.
        </p>
        <p className="my-2">
          Waiver. Any failure by Doge Labs to enforce a right or provision in these Terms does not constitute a waiver
          of such right or provision. A waiver of any right or provision will only be effective if it is in writing and
          signed by an authorized representative of Doge Labs. Except as explicitly stated in these Terms, the exercise
          of any remedy under these Terms by either party will not affect its other remedies under these Terms or
          otherwise.
        </p>
      </div>
    </PageBase>
  )
}

export default Terms
