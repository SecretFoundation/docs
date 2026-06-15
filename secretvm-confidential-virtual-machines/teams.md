# 👥 Teams

**Teams** let you collaborate with others by sharing SecretVMs and managing who can access them. Create a team, invite members by email or wallet address, assign each a role, and share specific VMs with the whole team — all from the **Teams** section of the portal.

<figure><img src="../.gitbook/assets/image (56).png" alt=""><figcaption></figcaption></figure>

### Creating a team

1. Go to **Teams** and click **Create New Team**.
2. Enter a **Team Name** (required) and an optional **Description**.
3. Under **Team Members**, add people by clicking **Add Member** and entering each person's **email address or wallet address**, then choosing their role (**Member** or **Admin**). Invitees receive an invitation to join.
4. Under **Shared VMs**, toggle on any of your existing VMs you want to share with the team. (If you have none yet, you'll be prompted to **Create VM** first.)
5. Click **Create Team**.

{% hint style="info" %}
You can create a team with no members or shared VMs and add them later — only the team name is required.
{% endhint %}

### Managing members

Open a team from the **Teams** list to reach its detail page.

#### Inviting more members

1. Click **Add Member** (visible to Owners and Admins).
2. Enter the person's **email address or wallet address** and choose a **Role** (Member or Admin).
3. Click **Add Member**.

The person receives an invitation. Until they accept, they appear in the member list with a **pending** status.

{% hint style="info" %}
Each person can only be invited once. You'll see "User is already a member of this team" or "Invitation has already been sent to this email address" if they're already listed. Invitations expire after **7 days** if not accepted.
{% endhint %}

#### Accepting or declining an invitation

When you've been invited, a **Pending Invitations** section appears at the top of your **Teams** page. Each invitation shows the team name, description, and who invited you. Click **Accept** to join or **Decline** to dismiss it.

#### Changing a member's role

In the team's member list, open the **⋮** (three-dot) menu next to a member and choose:

* **Set as Member**
* **Set as Admin**
* **Remove Member**

(Options are disabled where they don't apply — for example you can't change the Owner's role.)

#### Removing a member

From the same **⋮** menu, choose **Remove Member** and confirm. The team Owner cannot be removed.

### Sharing VMs with a team

Sharing a VM gives team members access to it according to their role. Only the team **Owner** can manage sharing.

1. On the team detail page, next to **Shared VMs**, click **Manage VMs**.
2. Toggle on the VMs you want to share (or toggle off ones you want to remove).
3. Click **Save Changes**.

Shared VMs are listed in the team's **Shared VMs** table, showing each VM's name, specs, status, and who shared it. From there:

* **View** (eye icon) opens the VM's detail page.
* **Remove** (✕ icon, Owner only) stops sharing that VM with the team. You'll be asked to confirm: "Are you sure you want to remove this VM from the team?"

{% hint style="info" %}
Only your own VMs can be shared with a team. If you have none, you'll see "You don't have any VMs to share with the team" — create a VM first.
{% endhint %}

### Leaving or deleting a team

* **Leave Team** (Members and Admins) — removes you from the team. Confirm "Are you sure you want to leave this team?"
* **Delete Team** (Owner only) — permanently deletes the team. Confirm "Are you sure you want to delete this team? This action cannot be undone."

{% hint style="warning" %}
Deleting a team cannot be undone. It removes the team and its sharing configuration — the VMs themselves are not deleted, but they are no longer shared with anyone through this team.
{% endhint %}
